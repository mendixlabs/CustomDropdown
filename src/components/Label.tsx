import React, { createElement, ReactElement } from 'react';

export interface LabelProps {
  DisplayName: string;
  UrlString: string;
  ClassNamePrefix: string;
  EnableAvatar: boolean;
  SecondLabel: string;
}

export default function Label(props: LabelProps): ReactElement {
  const userDefinedClassname = props.ClassNamePrefix;

  if (!document.querySelector('#custom-dropdown_css')) {
    let css = document.createElement('style');
    css.id = 'custom-dropdown_css';
    let styles =
      '.' +
      userDefinedClassname +
      '__avatar {flex: 0 0 24px; width: 24px; height: 24px; margin-right: 8px;border-radius: 50%; background-position: 50% 50%; background-size: 24px;}\
    .' +
      userDefinedClassname +
      '__avatar---initials {font-size: 9px;}\
    .' +
      userDefinedClassname +
      '__single-value {display: flex;align-items: center;}\
    .' +
      userDefinedClassname +
      '__option {display: flex !important; align-items: center; cursor:pointer;}\
    .' +
      userDefinedClassname +
      '__name {font-size: 14px; }\
      .' +
      userDefinedClassname +
      '__name.' +
      userDefinedClassname +
      '--name2 {font-size: 12px; line-height: 14px;color: gray; transform: translateY(1px);}\
      .' +
      userDefinedClassname +
      '__divider {width: 0.5rem}\
    .' +
      userDefinedClassname +
      '__menu-list {padding: 0 !important;}\
      .' +
      userDefinedClassname +
      '__avatar--initials {display: flex !important; justify-content: center; align-items: center; background: gray; color: white; text-transform: uppercase; text-align: center; font-size: 9px; font-weight: bold;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-a {background: BlueViolet;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-b { background: DarkViolet;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-c {background: Coral;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-d {background: LightCoral;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-e {background: DarkOliveGreen;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-f {background: GoldenRod;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-g {background: MediumAquaMarine;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-h {background: Olive;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-i {background: RebeccaPurple;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-j {background: SlateBlue;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-k {background: SteelBlue;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-l {background: Tomato;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-m {background: Teal;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-n {background: Purple;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-o {background: Peru;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-p {background: MediumVioletRed;)}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-q {background: Chocolate;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-r {background: IndianRed;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-s {background: MidnightBlue;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-t {background: DarkCyan;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-u {background: DarkSlateBlue;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-v {background: Brown;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-w {background: DarkOrchid;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-x {background: Darkorange;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-y {background: Navy;}\
      .' +
      userDefinedClassname +
      '__avatar--initials.color-z {background: SeaGreen}';

    css.appendChild(document.createTextNode(styles));
    document.getElementsByTagName('head')[0].appendChild(css);
  }

  if (props.UrlString == '' && props.EnableAvatar) {
    var nameSplit = props.DisplayName.split(' '),
      names = nameSplit.length,
      initials = nameSplit[0].charAt(0).toUpperCase(),
      colorClass = 'color-' + initials.toLowerCase();

    if (names > 1) {
      initials = initials + nameSplit[names - 1].charAt(0).toUpperCase();
    }
    return (
      <React.Fragment>
        <div
          className={
            props.ClassNamePrefix +
            '__avatar ' +
            props.ClassNamePrefix +
            '__avatar--initials ' +
            colorClass
          }
        >
          {initials}
        </div>
        <div className={props.ClassNamePrefix + '__name'}>
          {props.DisplayName}
        </div>
        {props.SecondLabel ? (
          <React.Fragment>
            <div className={props.ClassNamePrefix + '__divider'}></div>
            <div
              className={
                props.ClassNamePrefix +
                '__name ' +
                props.ClassNamePrefix +
                '--name2'
              }
            >
              {props.SecondLabel}
            </div>
          </React.Fragment>
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }
  if (props.EnableAvatar && props.UrlString) {
    return (
      <React.Fragment>
        <div
          className={props.ClassNamePrefix + '__avatar'}
          style={{
            backgroundImage: 'url(' + props.UrlString + ')',
          }}
        ></div>
        <div className={props.ClassNamePrefix + '__name'}>
          {props.DisplayName}
        </div>
        {props.SecondLabel ? (
          <React.Fragment>
            <div className={props.ClassNamePrefix + '__divider'}></div>
            <div
              className={
                props.ClassNamePrefix +
                '__name ' +
                props.ClassNamePrefix +
                '--name2'
              }
            >
              {props.SecondLabel}
            </div>
          </React.Fragment>
        ) : (
          ''
        )}
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <div className={props.ClassNamePrefix + '__name'}>
          {props.DisplayName}
        </div>
        {props.SecondLabel ? (
          <React.Fragment>
            <div className={props.ClassNamePrefix + '__divider'}></div>
            <div
              className={
                props.ClassNamePrefix +
                '__name ' +
                props.ClassNamePrefix +
                '--name2'
              }
            >
              {props.SecondLabel}
            </div>
          </React.Fragment>
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }
}
