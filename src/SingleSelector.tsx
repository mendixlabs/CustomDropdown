import { createElement, ReactElement } from "react";
import SingleSelect from "./components/SingleSelectorComp";

import { SingleSelectorContainerProps } from "../typings/SingleSelectorProps";

import "./ui/SingleSelector.css";

export default function SingleSelector(props: SingleSelectorContainerProps): ReactElement{
    return  <SingleSelect 
                defaultValue={props.defaultValue}
                defaultValueLabel={props.defaultValueLabel}
                options={props.options}
                optionsLabel={props.optionsLabel}
                contextObjLabel={props.contextObjLabel}
                selectOption={props.selectOption}
                enableCreate={props.enableCreate}
                createValue={props.createValue}
                enableClear={props.enableClear}
                clearValue={props.clearValue}
                enableSearch={props.enableSearch}
                useDefaultStyle={props.useDefaultStyle}
                placeholder={props.placeholder}
                className={props.className}
                classNamePrefix={props.classNamePrefix}
            />;
}
