[![Known Vulnerabilities](https://snyk.io/test/github/mendixlabs/CustomDropdown/badge.svg?targetFile=package.json)](https://snyk.io/test/github/mendixlabs/CustomDropdown?targetFile=package.json)
[![Support](https://img.shields.io/badge/Mendix%20Support%3A-Community-green.svg)](https://docs.mendix.com/community/app-store/app-store-content-support)

## CustomDropdown
A custom dropdown selection widget for Mendix. This widget allows you to fully customize the behaviour of the dropdown widget from within Mendix. Microflows can be set to determine exactly what should happen on select/create/clear actions.

## Features
- Selection
- Searching
- Creation (also in popup)
- Default image avatar
- Custom image avatar
- Second text field on selection item
- Custom classnames 

## Usage
Having a look at the test project can be a great help to understand how the widget is setup.
1. The widget requires a non persistent helper object to function. This object must have a string attribute to store the label of each item and a string attribute to store the id(If you want to uniquely retrieve the selected object in the selection microflow later on, an unique id is required). In the test project I named this object DropdownContext. 
2. Before placing the widget on a page you should add a dataview containing this helper object for the widget.
3. Place the widget inside this dataview.
4. Fill the Default value property. Currently it is only possible to return lists in this datasource property, therefore make sure to return a list only containing the object you want to have as the default value. For options the same object type must be selected. Please use a microflow as retrieve the data.
5. Fill the Options property. This will be all the selectable items in the dropdown menu. The same object type has to be selected as for the Default value. Please use a microflow as retrieve the data.
6. Fill First label attribute and optionally the Second label and Image URL attributes.
7. In the Events tab, specify the label and id attributes of the context object.
8. Create an microflow that should be triggered when an item is selected in the dropdown, and set this microflow for the Select option microflow.
9. Determine if you want to allow for creation, clearing and searching and if so also create and specify microflows for these actions.
10. Optionally configure a nano or microflow that will be triggerd once the dropdown gets focussed.
11. Optionally set several styling options in the styling tab. The useAvatar boolean will determine if an avatar img is shown for each item. By default an two letter icon is generated.

## Test project
A test project is stored at /tests/testProject.

## Issues, suggestions and feature requests
[link to GitHub issues](https://github.com/mendixlabs/CustomDropdown/issues)

## Development and contribution
This widget has community support level.

## Demo video
Can be found [here](https://youtu.be/e8WhGu1pufw).
