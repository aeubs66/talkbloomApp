import {
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  TextField,
} from "react-admin";

export const generalStoryList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="title" />
        <ReferenceField source="unitId" reference="units" />
        <TextField source="text" />
        <TextField source="gen_audio" />
        <NumberField source="order" />
      </Datagrid>
    </List>
  );
};
