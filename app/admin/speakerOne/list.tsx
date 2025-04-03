import {
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  TextField,
} from "react-admin";

export const SpeakerOneList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="content" />
        <TextField source="audioSrc" label="Audio Source" />
        <ReferenceField source="storyId" reference="story" label="Story" />
        <NumberField source="order" />
      </Datagrid>
    </List>
  );
};
