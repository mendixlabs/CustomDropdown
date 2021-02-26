import { useState, createElement, ReactElement, useEffect } from "react";
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';
import { Styles } from 'react-select/src/styles';
import { OptionTypeBase } from "react-select/src/types";

import { ListValue, EditableValue, ActionValue, ListAttributeValue } from "mendix";
import Label from './Label';

export interface Option {
    label: JSX.Element;
    value: string;
  }

export interface SingleSelectComponentProps {
    defaultValue: ListValue;
    defaultValueLabel: ListAttributeValue<string>;
    options: ListValue;
    optionsLabel: ListAttributeValue<string>;
    contextObjLabel: EditableValue<string>;
    selectOption?: ActionValue;
    enableCreate: boolean;
    createValue?: ActionValue;
    enableClear: boolean;
    clearValue?: ActionValue;
    enableSearch: boolean;
    useDefaultStyle: boolean;
    placeholder: string;
    className: string;
    classNamePrefix: string;
}

export default function SingleSelect(props: SingleSelectComponentProps): ReactElement{
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<Option[]>([]);
    const [value, setValue] = useState<Option>();

    const createOption = (label: string, secondaryLabel: string, urlstring: string) => ({
        label: <Label
                DisplayName={label}
                UrlString={urlstring}
                ClassNamePrefix={props.classNamePrefix}
                EnableAvatar={true}
                SecondLabel={secondaryLabel}
                classNameCreateModal={"xxx"}
            />,
        value: label
    });

    useEffect(() => {
        if(props.defaultValue.status === 'available'){
          const defaultValue = props.defaultValue.items.map(obj =>
            createOption(props.defaultValueLabel(obj).displayValue, "test", ''));
          setValue(defaultValue[0]);
        }
      }, [props.defaultValue]);

    useEffect(() => {
        if(props.options.status === 'available'){
          const tagSuggestions = props.options.items.map(obj =>
            createOption(props.defaultValueLabel(obj).displayValue, "test", ''));
          setOptions(tagSuggestions);
        }
      }, [props.options]);

      const handleChange = async (inputValue: any, actionMeta: any) => {
        if (
            actionMeta.action === 'select-option'
        ) {
          setIsLoading(true);
          try {
            if(props.contextObjLabel.status==='available'){
              props.contextObjLabel.setValue(inputValue.value);
            }
            if(props.selectOption.canExecute){
              props.selectOption.execute();
            }
            setValue(createOption(inputValue.value, 'test', ''));
          } catch (err) {
            console.error('Failed to select a Tag: ' + err);
          }
          setIsLoading(false);
        }
        if (
          actionMeta.action === 'create-option'
        ) {
          setIsLoading(true);
          try {
            if(props.contextObjLabel.status==='available'){
              props.contextObjLabel.setValue(inputValue.value);
            }
            if(props.createValue.canExecute){
              props.createValue.execute();
            }
            setValue(createOption(inputValue.value, 'test', ''));
            setOptions([...options, createOption(inputValue.value, 'test', '')]);
          } catch (err) {
            console.error('Failed to create a Tag: ' + err);
          }
          setIsLoading(false);
        }
        if (
            actionMeta.action === 'clear'
          ) {
            setIsLoading(true);
            try {
              if(props.contextObjLabel.status==='available'){
                  console.log(actionMeta);
                props.contextObjLabel.setValue(actionMeta.removedValues[0].value);
              }
              if(props.clearValue.canExecute){
                props.clearValue.execute();
              }
              setValue(null);
            } catch (err) {
              console.error('Failed to create a Tag: ' + err);
            }
            setIsLoading(false);
          }
      };
      let styles: Styles<OptionTypeBase, true> = {};
      if (!props.useDefaultStyle) {
        styles = {
          clearIndicator: () => ({}),
          container: () => ({}),
          control: () => ({}),
          dropdownIndicator: () => ({}),
          group: () => ({}),
          groupHeading: () => ({}),
          indicatorsContainer: () => ({}),
          indicatorSeparator: () => ({}),
          input: () => ({}),
          loadingIndicator: () => ({}),
          loadingMessage: () => ({}),
          menu: () => ({}),
          menuList: () => ({}),
          menuPortal: () => ({}),
          multiValue: () => ({}),
          multiValueLabel: () => ({}),
          multiValueRemove: () => ({}),
          noOptionsMessage: () => ({}),
          option: () => ({}),
          placeholder: () => ({}),
          singleValue: () => ({}),
          valueContainer: () => ({}),
        };
      }
if(props.enableCreate){
    return(
        <CreatableSelect
            options={options}
            value={value}
            onChange={handleChange}
            isLoading={isLoading}
            isClearable={props.enableClear}
            isSearchable={props.enableSearch}
            styles={styles}
            placeholder={props.placeholder}
            className={props.className!}
            classNamePrefix={props.classNamePrefix}
        />
    )
}
    return (
        <Select
            options={options}
            value={value}
            onChange={handleChange}
            isLoading={isLoading}
            isClearable={props.enableClear}
            isSearchable={props.enableSearch}
            styles={styles}
            placeholder={props.placeholder}
            className={props.className!}
            classNamePrefix={props.classNamePrefix}
        />
    )
}