import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalogPath = path.join(repoRoot, 'forms', 'catalog.js');

function makeBlockedApi(name) {
  return () => {
    throw new Error(`${name} is disabled in the catalog validation sandbox`);
  };
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasUnsafeCatalogContent(value) {
  const text = String(value);
  return /<|>|<\s*script\b|on\w+\s*=|javascript\s*:/i.test(text);
}

function validateRequiredSafeText(errors, fieldPath, value) {
  if (!isNonEmptyString(value)) {
    errors.push(`${fieldPath} must be a non-empty string`);
    return false;
  }

  if (hasUnsafeCatalogContent(value)) {
    errors.push(`${fieldPath} must not contain HTML or script-like content`);
    return false;
  }

  return true;
}

function validateOptionalSafeText(errors, fieldPath, value) {
  if (typeof value === 'undefined') return true;
  return validateRequiredSafeText(errors, fieldPath, value);
}

function isSafeCatalogUrl(value) {
  if (!isNonEmptyString(value) || hasUnsafeCatalogContent(value)) return false;

  const url = value.trim();
  if (/^https:\/\/[^\s<>"'`\\]+$/i.test(url)) return true;

  return /^(?!\/\/)(?![a-zA-Z][a-zA-Z\d+.-]*:)[^\s<>"'`\\]+$/.test(url);
}

function validateCatalogUrl(errors, fieldPath, value) {
  if (!isSafeCatalogUrl(value)) {
    errors.push(`${fieldPath} must be an https:// URL or safe relative path`);
  }
}

function normalizeBooleanish(value) {
  if (typeof value === 'boolean') return value;
  if (value === 1 || value === '1') return true;
  if (value === 0 || value === '0') return false;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }
  return null;
}

function isChoiceLikeType(type) {
  const normalized = String(type || '').trim();
  return normalized === 'Multiple Choice'
    || normalized === 'Checkboxes'
    || normalized === 'Dropdown'
    || normalized.startsWith('Linear Scale');
}

function validateReference(question, questionPath, errors) {
  if (!Object.prototype.hasOwnProperty.call(question, 'reference')) return;

  const reference = question.reference;
  if (!reference || typeof reference !== 'object' || Array.isArray(reference)) {
    errors.push(`${questionPath}.reference must be an object`);
    return;
  }

  if ('enabled' in reference && normalizeBooleanish(reference.enabled) === null) {
    errors.push(`${questionPath}.reference.enabled must be boolean-ish`);
  }

  if ('label' in reference) {
    validateOptionalSafeText(errors, `${questionPath}.reference.label`, reference.label);
  }

  if ('items' in reference) {
    if (!Array.isArray(reference.items)) {
      errors.push(`${questionPath}.reference.items must be an array when present`);
      return;
    }

    if (normalizeBooleanish(reference.enabled) !== false) {
      reference.items.forEach((item, itemIndex) => {
        const itemPath = `${questionPath}.reference.items[${itemIndex}]`;
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
          errors.push(`${itemPath} must be an object`);
          return;
        }
        validateCatalogUrl(errors, `${itemPath}.url`, item.url);
        validateRequiredSafeText(errors, `${itemPath}.type`, item.type);
        validateRequiredSafeText(errors, `${itemPath}.hint`, item.hint);
      });
    }
  }
}

function validateCatalog(catalog) {
  const errors = [];

  if (!catalog || typeof catalog !== 'object' || Array.isArray(catalog)) {
    return ['window.GX_FORM_CATALOG must be an object'];
  }

  if (!catalog.forms || typeof catalog.forms !== 'object' || Array.isArray(catalog.forms)) {
    errors.push('window.GX_FORM_CATALOG.forms must be an object');
    return errors;
  }

  const formKeys = Object.keys(catalog.forms);
  if (formKeys.length === 0) {
    errors.push('window.GX_FORM_CATALOG.forms must contain at least one form');
    return errors;
  }

  for (const formKey of formKeys) {
    const formEntry = catalog.forms[formKey];
    const formPath = `forms.${formKey}`;

    if (!formEntry || typeof formEntry !== 'object' || Array.isArray(formEntry)) {
      errors.push(`${formPath} must be an object`);
      continue;
    }

    if (!isNonEmptyString(formEntry.activeVersion)) {
      errors.push(`${formPath}.activeVersion must be a non-empty string`);
    }

    if (!formEntry.versions || typeof formEntry.versions !== 'object' || Array.isArray(formEntry.versions)) {
      errors.push(`${formPath}.versions must be an object`);
      continue;
    }

    const versionKeys = Object.keys(formEntry.versions);
    if (versionKeys.length === 0) {
      errors.push(`${formPath}.versions must contain at least one version`);
      continue;
    }

    if (isNonEmptyString(formEntry.activeVersion) && !Object.prototype.hasOwnProperty.call(formEntry.versions, formEntry.activeVersion)) {
      errors.push(`${formPath}.activeVersion must reference an existing version`);
    }

    for (const versionKey of versionKeys) {
      const version = formEntry.versions[versionKey];
      const versionPath = `${formPath}.versions.${versionKey}`;

      if (!version || typeof version !== 'object' || Array.isArray(version)) {
        errors.push(`${versionPath} must be an object`);
        continue;
      }

      validateRequiredSafeText(errors, `${versionPath}.label`, version.label);
      validateRequiredSafeText(errors, `${versionPath}.status`, version.status);

      const form = version.form;
      const versionFormPath = `${versionPath}.form`;
      if (!form || typeof form !== 'object' || Array.isArray(form)) {
        errors.push(`${versionFormPath} must be an object`);
        continue;
      }

      validateRequiredSafeText(errors, `${versionFormPath}.title`, form.title);

      if ('duration' in form) {
        validateRequiredSafeText(errors, `${versionFormPath}.duration`, form.duration);
      }

      if ('target' in form) {
        validateRequiredSafeText(errors, `${versionFormPath}.target`, form.target);
      }

      if (!Array.isArray(form.sections) || form.sections.length === 0) {
        errors.push(`${versionFormPath}.sections must be a non-empty array`);
        continue;
      }

      const seenQuestionIds = new Set();

      form.sections.forEach((section, sectionIndex) => {
        const sectionPath = `${versionFormPath}.sections[${sectionIndex}]`;
        if (!section || typeof section !== 'object' || Array.isArray(section)) {
          errors.push(`${sectionPath} must be an object`);
          return;
        }

        validateRequiredSafeText(errors, `${sectionPath}.title`, section.title);

        if ('instruction' in section) {
          validateOptionalSafeText(errors, `${sectionPath}.instruction`, section.instruction);
        }

        if (!Array.isArray(section.questions) || section.questions.length === 0) {
          errors.push(`${sectionPath}.questions must be a non-empty array`);
          return;
        }

        section.questions.forEach((question, questionIndex) => {
          const questionPath = `${sectionPath}.questions[${questionIndex}]`;
          if (!question || typeof question !== 'object' || Array.isArray(question)) {
            errors.push(`${questionPath} must be an object`);
            return;
          }

          if (!validateRequiredSafeText(errors, `${questionPath}.id`, question.id)) {
            // fall through to preserve duplicate-id checks only for valid IDs
          } else {
            const questionId = question.id.trim();
            if (seenQuestionIds.has(questionId)) {
              errors.push(`${versionPath} has duplicate question id "${questionId}"`);
            } else {
              seenQuestionIds.add(questionId);
            }
          }

          validateRequiredSafeText(errors, `${questionPath}.text`, question.text);

          validateRequiredSafeText(errors, `${questionPath}.type`, question.type);

          if (!Array.isArray(question.options)) {
            errors.push(`${questionPath}.options must be an array`);
          } else if (isNonEmptyString(question.type)) {
            const type = question.type.trim();
            if (type === 'File Upload' && question.options.length !== 0) {
              errors.push(`${questionPath}.options must be empty for File Upload questions`);
            }
            if (isChoiceLikeType(type) && question.options.length === 0) {
              errors.push(`${questionPath}.options must be a non-empty array for ${type} questions`);
            }
            question.options.forEach((option, optionIndex) => {
              validateRequiredSafeText(errors, `${questionPath}.options[${optionIndex}]`, option);
            });
          }

          if ('mediaUrl' in question) {
            validateCatalogUrl(errors, `${questionPath}.mediaUrl`, question.mediaUrl);
          }

          if ('mediaUrls' in question) {
            if (!Array.isArray(question.mediaUrls)) {
              errors.push(`${questionPath}.mediaUrls must be an array when present`);
            } else {
              question.mediaUrls.forEach((url, mediaIndex) => {
                validateCatalogUrl(errors, `${questionPath}.mediaUrls[${mediaIndex}]`, url);
              });
            }
          }

          if ('mediaItems' in question) {
            if (!Array.isArray(question.mediaItems)) {
              errors.push(`${questionPath}.mediaItems must be an array when present`);
            } else {
              question.mediaItems.forEach((item, itemIndex) => {
                const itemPath = `${questionPath}.mediaItems[${itemIndex}]`;
                if (typeof item === 'string') {
                  validateCatalogUrl(errors, itemPath, item);
                  return;
                }

                if (!item || typeof item !== 'object' || Array.isArray(item)) {
                  errors.push(`${itemPath} must be an object or string`);
                  return;
                }

                validateCatalogUrl(errors, `${itemPath}.url`, item.url);
                validateOptionalSafeText(errors, `${itemPath}.type`, item.type);
                validateOptionalSafeText(errors, `${itemPath}.hint`, item.hint);
              });
            }
          }

          if ('mediaType' in question) {
            validateOptionalSafeText(errors, `${questionPath}.mediaType`, question.mediaType);
          }

          if ('mediaHint' in question) {
            validateOptionalSafeText(errors, `${questionPath}.mediaHint`, question.mediaHint);
          }

          validateReference(question, questionPath, errors);
        });
      });
    }
  }

  return errors;
}

function loadCatalog() {
  const source = fs.readFileSync(catalogPath, 'utf8');
  const blocked = makeBlockedApi;
  const sandbox = {
    console: {
      log() {},
      info() {},
      warn() {},
      error() {},
      debug() {}
    },
    fetch: blocked('fetch'),
    Request: blocked('Request'),
    Response: blocked('Response'),
    Headers: blocked('Headers'),
    XMLHttpRequest: blocked('XMLHttpRequest'),
    WebSocket: blocked('WebSocket'),
    EventSource: blocked('EventSource'),
    setTimeout: blocked('setTimeout'),
    setInterval: blocked('setInterval'),
    clearTimeout() {},
    clearInterval() {}
  };

  sandbox.window = sandbox;
  sandbox.self = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.global = sandbox;
  sandbox.process = undefined;
  sandbox.require = undefined;

  const context = vm.createContext(sandbox, {
    codeGeneration: {
      strings: false,
      wasm: false
    }
  });

  vm.runInContext(source, context, {
    filename: catalogPath,
    timeout: 1000
  });

  return sandbox.GX_FORM_CATALOG;
}

function main() {
  let catalog;
  try {
    catalog = loadCatalog();
  } catch (error) {
    console.error(`Failed to load ${path.relative(repoRoot, catalogPath)}: ${error.message}`);
    process.exit(1);
  }

  const errors = validateCatalog(catalog);
  if (errors.length > 0) {
    console.error(`Forms catalog validation failed (${errors.length} issue${errors.length === 1 ? '' : 's'}):`);
    errors.forEach(error => console.error(`- ${error}`));
    process.exit(1);
  }

  const formCount = Object.keys(catalog.forms).length;
  console.log(`Forms catalog validation passed (${formCount} forms).`);
}

main();
