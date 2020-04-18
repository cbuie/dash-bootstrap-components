import React from 'react';
import PropTypes from 'prop-types';
import {append, contains, without} from 'ramda';
import classNames from 'classnames';
import CustomInput from '../../private/CustomInput';

/**
 * Checklist is a component that encapsulates several checkboxes.
 * The values and labels of the checklist is specified in the `options`
 * property and the checked items are specified with the `value` property.
 * Each checkbox is rendered as an input / label pair.
 *
 * If `Checklist` is given an `id` (which is necessary for use in callbacks) it
 * will use Bootstrap's custom checkbox style, which hides the native browser
 * checkbox and renders a custom CSS alternative. See the Bootstrap docs for
 * details.
 *
 * https://getbootstrap.com/docs/4.4/components/forms/#checkboxes-and-radios-1
 */
class Checklist extends React.Component {
  constructor(props) {
    super(props);

    this.listItem = this.listItem.bind(this);
  }

  listItem(option) {
    const {
      id,
      inputClassName,
      inputStyle,
      labelClassName,
      labelCheckedClassName,
      labelStyle,
      labelCheckedStyle,
      setProps,
      inline,
      value,
      custom,
      switch: switches
    } = this.props;

    const checked = contains(option.value, value);

    const mergedLabelStyle = checked
      ? {...labelStyle, ...labelCheckedStyle}
      : labelStyle;

    if (id && custom) {
      return (
        <CustomInput
          id={`_${id}-${option.value}`}
          checked={checked}
          className={inputClassName}
          disabled={Boolean(option.disabled)}
          type={switches ? 'switch' : 'checkbox'}
          label={option.label}
          labelStyle={mergedLabelStyle}
          labelClassName={classNames(
            labelClassName,
            checked && labelCheckedClassName
          )}
          inline={inline}
          onChange={() => {
            let newValue;
            if (contains(option.value, value)) {
              newValue = without([option.value], value);
            } else {
              newValue = append(option.value, value);
            }
            setProps({value: newValue});
          }}
          key={option.value}
        />
      );
    } else {
      // it shouldn't ever really happen that an id isn't supplied, but in case
      // it is we use _dbcprivate_checklist
      const inputId = `_${id || "_dbcprivate_checklist"}-${option.value}`
      return (
        <div
          className={classNames('form-check', inline && 'form-check-inline')}
          key={option.value}
        >
          <input
            id={inputId}
            checked={checked}
            className={classNames('form-check-input', inputClassName)}
            disabled={Boolean(option.disabled)}
            style={inputStyle}
            type="checkbox"
            onChange={() => {
              let newValue;
              if (contains(option.value, value)) {
                newValue = without([option.value], value);
              } else {
                newValue = append(option.value, value);
              }
              setProps({value: newValue});
            }}
          />
          <label
            style={mergedLabelStyle}
            className={classNames(
              'form-check-label',
              labelClassName,
              checked && labelCheckedClassName
            )}
            key={option.value}
            htmlFor={inputId}
          >
            {option.label}
          </label>
        </div>
      );
    }
  }

  render() {
    const {className, id, options, style, key, loading_state} = this.props;

    const items = options.map(option => this.listItem(option));

    return (
      <div
        id={id}
        style={style}
        className={className}
        key={key}
        data-dash-is-loading={
          (loading_state && loading_state.is_loading) || undefined
        }
      >
        {items}
      </div>
    );
  }
}

Checklist.propTypes = {
  /**
   * The ID of this component, used to identify dash components in callbacks.
   * The ID needs to be unique across all of the components in an app.
   */
  id: PropTypes.string,

  /**
   * An array of options
   */
  options: PropTypes.arrayOf(
    PropTypes.exact({
      /**
       * The checkbox's label
       */
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,

      /**
       * The value of the checkbox. This value corresponds to the items
       * specified in the `value` property.
       */
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,

      /**
       * If true, this checkbox is disabled and can't be clicked on.
       */
      disabled: PropTypes.bool
    })
  ),

  /**
   * The currently selected value
   */
  value: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),

  /**
   * The class of the container (div)
   */
  className: PropTypes.string,

  /**
   * The style of the container (div)
   */
  style: PropTypes.object,

  /**
   * A unique identifier for the component, used to improve
   * performance by React.js while rendering components
   * See https://reactjs.org/docs/lists-and-keys.html for more info
   */
  key: PropTypes.string,

  /**
   * The style of the <input> checkbox element. Only used if custom=False
   */
  inputStyle: PropTypes.object,

  /**
   * The class of the <input> checkbox element
   */
  inputClassName: PropTypes.string,

  /**
   * Inline style arguments to apply to the <label> element for each item.
   */
  labelStyle: PropTypes.object,

  /**
   * Additional inline style arguments to apply to <label> elements on checked
   * items.
   */
  labelCheckedStyle: PropTypes.object,

  /**
   * CSS classes to apply to the <label> element for each item.
   */
  labelClassName: PropTypes.string,

  /**
   * Additional CSS classes to apply to the <label> element when the
   * corresponding checkbox is checked.
   */
  labelCheckedClassName: PropTypes.string,

  /**
   * Dash-assigned callback that gets fired when the value changes.
   */
  setProps: PropTypes.func,

  /**
   * Arrange Checklist inline
   */
  inline: PropTypes.bool,

  /**
   * Set to True to render toggle-like switches instead of checkboxes. Ignored
   * if custom=False
   */
  switch: PropTypes.bool,

  /**
   * RadioItems uses custom radio buttons by default. To use native radios set
   * custom to False.
   */
  custom: PropTypes.bool,

  /**
   * Object that holds the loading state object coming from dash-renderer
   */
  loading_state: PropTypes.shape({
    /**
     * Determines if the component is loading or not
     */
    is_loading: PropTypes.bool,
    /**
     * Holds which property is loading
     */
    prop_name: PropTypes.string,
    /**
     * Holds the name of the component that is loading
     */
    component_name: PropTypes.string
  }),

  /**
   * Used to allow user interactions in this component to be persisted when
   * the component - or the page - is refreshed. If `persisted` is truthy and
   * hasn't changed from its previous value, a `value` that the user has
   * changed while using the app will keep that change, as long as
   * the new `value` also matches what was given originally.
   * Used in conjunction with `persistence_type`.
   */
  persistence: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number
  ]),

  /**
   * Properties whose user interactions will persist after refreshing the
   * component or the page. Since only `value` is allowed this prop can
   * normally be ignored.
   */
  persisted_props: PropTypes.arrayOf(PropTypes.oneOf(['value'])),

  /**
   * Where persisted user changes will be stored:
   * memory: only kept in memory, reset on page refresh.
   * local: window.localStorage, data is kept after the browser quit.
   * session: window.sessionStorage, data is cleared once the browser quit.
   */
  persistence_type: PropTypes.oneOf(['local', 'session', 'memory'])
};

Checklist.defaultProps = {
  inputStyle: {},
  inputClassName: '',
  labelStyle: {},
  labelClassName: '',
  options: [],
  value: [],
  custom: true,
  persisted_props: ['value'],
  persistence_type: 'local'
};

export default Checklist;
