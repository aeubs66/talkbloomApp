import {
  Edit,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

export const SpeakerOneEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="content" validate={[required()]} label="Content" />
        <TextInput source="audioSrc" validate={[required()]} label="Audio Source" />
        <ReferenceInput source="storyId" reference="story" validate={[required()]} label="Story" />
        <NumberInput source="order" validate={[required()]} label="Order" />
      </SimpleForm>
    </Edit>
  );
};
