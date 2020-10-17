import _ from 'lodash';
import Joi from 'joi';
import PropTypes from 'prop-types';
import i18n from 'i18n-js';
import { createSelector } from 'reselect';
import {
  useCallback, useMemo, useState, useReducer, useRef, useEffect,
} from 'react';

import { delay } from 'controls/utils';
import { useEffectSkipMount, useIsMounted } from './misc';

const messages = {

  es: {
    'root': 'valor',
    'string.alphanum': '{{#label}} solo debe contener valores alfanuméricos',
    'string.base': '{{#label}} debe ser una cadena de texto',
    'string.email': '{{#label}} debe ser un correo valido',
    'string.empty': '{{#label}} no puede estar vacío(a)',
    'string.length': '{{#label}} debe de tener {{#limit}} caracteres de longitud',
    'string.max': '{{#label}} debe tener o ser menor de {{#limit}} caracteres',
    'string.min': '{{#label}} debe de ser al menos {{#limit}} caracteres',

    'number.base': '{{#label}} debe ser un número',
    'number.greater': '{{#label}} debe ser mayor a {{#limit}}',
    'number.integer': '{{#label}} debe ser un entero',
    'number.less': '{{#label}} debe ser menor a {{#limit}}',
    'number.max': '{{#label}} debe ser menor o igual a {{#limit}}',
    'number.min': '{{#label}} debe ser mayor o igual a {{#limit}}',
    'number.positive': '{{#label}} debe ser un numero positivo',

    'date.base': '{{#label}} debe ser una fecha valida',
    'date.greater': '{{#label}} debe ser después de {{:#limit}}',
    'date.less': '{{#label}} debe ser antes de {{:#limit}}',
    'date.max': '{{#label}} debe ser antes o igual a {{:#limit}}',
    'date.min': '{{#label}} debe ser después o igual a {{:#limit}}',

    'boolean.base': '{{#label}} debe ser un booleano',

    'array.base': '{{#label}} debe ser una lista',
    'array.excludes': '{{#label}} contiene un valor no permitido',
    'array.includes': '{{#label}} no tiene ninguno de los valores permitidos',
    'array.length': '{{#label}} debe contener {{#limit}} elementos',
    'array.max': '{{#label}} debe contener como máximo {{#limit}} elementos',
    'array.min': '{{#label}} debe contener al menos {{#limit}} elementos',
    'array.unique': '{{#label}} contiene valores duplicados',

    'any.invalid': '{{#label}} contiene un valor invalido',
    'any.required': '{{#label}} es requerido(a)',
    'any.unknown': '{{#label}} no esta permitido(a)',
  },

};

const defaultClone = _.cloneDeep;

const errorsReducer = (state, { type, field, value }) => {
  switch (type) {
    case 'SET_ALL': return value;
    case 'SET_VALUE': return { ...state, [field]: value };
    default: throw new Error('Invalid action');
  }
};
const sourceReducer = (state, { type, field, value }) => {
  switch (type) {
    case 'SET_ALL': return value;
    case 'SET_VALUE':
      state[field] = value;
      return state;
    default: throw new Error('Invalid action');
  }
};

export const useFieldset = ({
  schema,
  onSubmit,
  enabled = true,
  partial = false,
  cloneSource = defaultClone,
  source: templateSource,
  validator,
}) => {
  const validatorRef = useRef();
  const children = useRef(new Set());
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useReducer(errorsReducer, {});
  const [source, setSource] = useReducer(sourceReducer, undefined, () => (validator ? templateSource || {} : cloneSource(templateSource || {})));
  const isMounted = useIsMounted();
  const [submitValueToParentCount, submitValueToParent] = useReducer((x) => x + 1, 0);

  useEffectSkipMount(() => {
    setLoading(false);
    setErrors({ type: 'SET_ALL', value: {} });
    setSource({ type: 'SET_ALL', value: validator ? templateSource || {} : cloneSource(templateSource || {}) });
  }, [cloneSource, enabled, schema, templateSource, validator]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (validator) {
      validator.current.add(validatorRef);
    }
    return () => {
      if (validator) {
        validator.current.delete(validatorRef);
      }
    };
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (submitValueToParentCount > 0) {
      onSubmit(source);
    }
  }, [submitValueToParentCount]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback(validator ? _.noop : () => { // eslint-disable-line react-hooks/exhaustive-deps
    setLoading(false);
    setErrors({ type: 'SET_ALL', value: {} });
    setSource({ type: 'SET_ALL', value: cloneSource(templateSource || {}) });
  }, [cloneSource, templateSource]);

  const submit = useCallback(async (e) => {
    _.invoke(onSubmit && e, 'preventDefault');
    setLoading(true);
    setErrors({ type: 'SET_ALL', value: {} });

    /* eslint-disable no-await-in-loop */
    const childrenResults = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const childrenRef of children.current) {
      childrenResults.push(await childrenRef.current.submit());
      await delay(0); // yield execution to allow react to execute batched children results
    }
    /* eslint-enable no-await-in-loop */

    const { error, value: validatedSource } = Joi.object(schema).validate(source, {
      abortEarly: false, allowUnknown: true, messages, errors: { wrap: { label: '' }, language: i18n.locale },
    });

    if (error) {
      _.invoke(!onSubmit && e, 'preventDefault'); // cancel form submit in case of traditional form validation
      // eslint-disable-next-line no-console
      console.warn('validation failed', error.details);
      setLoading(false);
      setErrors({
        type: 'SET_ALL',
        value: _.transform(error.details, (errs, { path: [key], message }) => {
          errs[key] = message;
        }, {}),
      });
      return false;
    } if (!onSubmit) { // no need to do more work in case of a traditional form validation
      return true;
    }

    if (_.some(childrenResults, (result) => result === false)) { // children fieldsets might have stricter validations than the parent fieldset
      setLoading(false);
      return false;
    }

    const newSource = _.pickBy(validatedSource, _.negate(_.isUndefined));
    const success = await onSubmit(newSource);

    if (isMounted.current) {
      setLoading(false);
      setErrors({ type: 'SET_ALL', value: {} });
    }

    return success;
  }, [onSubmit, schema, source, isMounted]);

  const fields = _.mapValues(
    useMemo(() => _.mapValues(schema, (ignored, field) => createSelector(
      _.iteratee('value'), _.iteratee('error'), _.iteratee('enabled'),
      (currentValue, error, active) => ({
        value: currentValue,
        message: error,
        errored: !!error,
        onChange: !active ? _.noop : (value, { value: maybeValue, checked: maybeValue2 } = {}) => {
          // eslint-disable-next-line no-nested-ternary
          const newVal = _.has(value, 'target.value') ? value.target.value : _.has(value, 'target.checked') ? value.target.checked : !_.isUndefined(maybeValue) ? maybeValue : (!_.isUndefined(maybeValue2) ? maybeValue2 : value);
          setSource({ type: 'SET_VALUE', field, value: newVal });
          setErrors({ type: 'SET_VALUE', field, value: undefined });
          if (validator) {
            submitValueToParent();
          }
          return true;
        },
      }),
    )), [schema, validator]),
    (creator, field) => creator({ enabled, value: source[field], error: errors[field] }),
  );

  validatorRef.current = useMemo(() => ({
    add: (ref) => children.current.add(ref),
    delete: (ref) => children.current.delete(ref),
    submit: validator ? submit : undefined,
  }), [submit, validator]);

  return {
    fields,
    loading,
    validator: validatorRef,
    reset: enabled ? reset : _.noop,
    submit: enabled ? submit : _.noop,
    partial: partial ? cloneSource(source) : undefined,
  };
};

useFieldset.fieldProp = PropTypes.exact({
  onChange: PropTypes.func.isRequired,
  message: PropTypes.string,
  errored: PropTypes.bool.isRequired,
  value: PropTypes.any,
});
