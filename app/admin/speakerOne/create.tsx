import {
  Create,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
  required,
  SelectInput,
} from "react-admin";

export const SpeakerOneCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="content" validate={[required()]} label="Content" />
        <TextInput source="audio_src" validate={[required()]} label="Audio Source" />
        <ReferenceInput source="story_id" reference="story" label="Story">
          <SelectInput validate={[required()]} optionText="title" />
        </ReferenceInput>
        <NumberInput source="order" validate={[required()]} label="Order" />
      </SimpleForm>
    </Create>
  );
};
