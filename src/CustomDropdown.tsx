import { createElement, ReactElement } from "react";
import CustomDropdownComp from "./components/CustomDropdownComp";

import { CustomDropdownContainerProps } from "../typings/CustomDropdownProps";

export default function CustomDropdown(props: CustomDropdownContainerProps): ReactElement {
    return (
        <CustomDropdownComp
            defaultValue={props.defaultValue}
            firstLabelDefaultValue={props.firstLabelDefaultValue}
            secondLabelDefaultValue={props.secondLabelDefaultValue}
            objIdDefaultValue={props.objIdDefaultValue}
            imgUrlDefaultValue={props.imgUrlDefaultValue}
            options={props.options}
            firstLabelOptions={props.firstLabelOptions}
            secondLabelOptions={props.secondLabelOptions}
            objIdOptions={props.objIdOptions}
            imgUrlOptions={props.imgUrlOptions}
            contextObjLabel={props.contextObjLabel}
            contextObjId={props.contextObjId}
            selectOption={props.selectOption}
            enableCreate={props.enableCreate}
            createValue={props.createValue}
            enableClear={props.enableClear}
            clearValue={props.clearValue}
            enableSearch={props.enableSearch}
            useAvatar={props.useAvatar}
            useDefaultStyle={props.useDefaultStyle}
            placeholder={props.placeholder}
            className={props.className}
            classNamePrefix={props.classNamePrefix}
            menuHeight={props.menuHeight}
            onFocus={props.onFocus}
        />
    );
}
