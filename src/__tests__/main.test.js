import React from 'react';
import Button from '../components/common/button';
import TextInput from '../components/common/textinput';
import renderer from 'react-test-renderer';

test('<Button text=Send>', () => {
  const _button = renderer.create(<Button text='Send'/>);
  let json_string = _button.toJSON();
  expect(json_string).toMatchSnapshot();
});

test('<TextInput text=Send name=testname value=kot readOnly>', () => {
  const _button = renderer.create(
    <TextInput text='Send' name='testname' value='kot' readOnly>
      <div>hello world</div>
    </TextInput>
  );
  let json_string = _button.toJSON();
  expect(json_string).toMatchSnapshot();
});
