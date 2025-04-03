"use client";

import simpleRestProvider from "ra-data-simple-rest";
import { Admin, Resource } from "react-admin";

import { ChallengeCreate } from "./challenge/create";
import { ChallengeEdit } from "./challenge/edit";
import { ChallengeList } from "./challenge/list";
import { ChallengeOptionCreate } from "./challengeOption/create";
import { ChallengeOptionEdit } from "./challengeOption/edit";
import { ChallengeOptionsList } from "./challengeOption/list";
import { CourseCreate } from "./course/create";
import { CourseEdit } from "./course/edit";
import { CourseList } from "./course/list";
import { generalStoryCreate } from "./generalStory/create";
import { generalStoryEdit } from "./generalStory/edit";
import { generalStoryList } from "./generalStory/list";
import { LessonCreate } from "./lesson/create";
import { LessonEdit } from "./lesson/edit";
import { LessonList } from "./lesson/list";
import { SpeakerOneCreate } from "./speakerOne/create";
import { SpeakerOneEdit } from "./speakerOne/edit";
import { SpeakerOneList } from "./speakerOne/list";
import { speakerTowCreate } from "./speakerTow/create";
import { speakerTowEdit } from "./speakerTow/edit";
import { speakerTowList } from "./speakerTow/list";
import { StoryList } from "./story/list";
import { UnitCreate } from "./unit/create";
import { UnitEdit } from "./unit/edit";
import { UnitList } from "./unit/list";

const dataProvider = simpleRestProvider("/api");

const App = () => {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource
        name="courses"
        recordRepresentation="title"
        list={CourseList}
        create={CourseCreate}
        edit={CourseEdit}
      />

      <Resource
        name="units"
        recordRepresentation="title"
        list={UnitList}
        create={UnitCreate}
        edit={UnitEdit}
      />

      <Resource
        name="lessons"
        recordRepresentation="title"
        list={LessonList}
        create={LessonCreate}
        edit={LessonEdit}
      />

      <Resource
        name="story"
        recordRepresentation="title"
        list={StoryList}
        create={LessonCreate}
        edit={LessonEdit}
      />

      <Resource
        name="speakerOne"
        recordRepresentation="content"
        list={SpeakerOneList}
        create={SpeakerOneCreate}
        edit={SpeakerOneEdit}
        options={{
          label: "Character One",
        }}
      />

      <Resource
        name="speakerTow"
        recordRepresentation="content"
        list={speakerTowList}
        create={speakerTowCreate}
        edit={speakerTowEdit}
        options={{
          label: "Character Two",
        }}
      />

      <Resource
        name="generalStory"
        recordRepresentation="content"
        list={generalStoryList}
        create={generalStoryCreate}
        edit={generalStoryEdit}
        options={{
          label: "General Story",
        }}
      />

      <Resource
        name="challenges"
        recordRepresentation="question"
        list={ChallengeList}
        create={ChallengeCreate}
        edit={ChallengeEdit}
      />

      <Resource
        name="challengeOptions"
        recordRepresentation="text"
        list={ChallengeOptionsList}
        create={ChallengeOptionCreate}
        edit={ChallengeOptionEdit}
        options={{
          label: "Challenge Options",
        }}
      />
    </Admin>
  );
};

export default App;
