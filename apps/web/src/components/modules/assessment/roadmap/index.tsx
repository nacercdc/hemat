import React from "react";
import { PageContainer } from "../../components/PageContainer";
interface SubComponent {
  id: string;
  name: string;
  description: string;
}

interface Component {
  id: string;
  name: string;
  subComponents: SubComponent[];
}

interface Domain {
  id: string;
  name: string;
  components: Component[];
}
const domain: Domain = {
  id: "1",
  name: "Domain 1",
  components: [
    {
      id: "1",
      name: "Component 1",
      subComponents: [
        {
          id: "1",
          name: "SubComponent 1",
          description:
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nostrum voluptas aliquid asperiores, dolores nesciunt corrupti quae adipisci, vel, mollitia deleniti repudiandae! Dolorem dolor recusandae aliquam laboriosam mollitia rerum, veritatis blanditiis assumenda et obcaecati maiores totam vel quia eaque numquam molestias ducimus sequi quae similique consequatur. Dolorum perspiciatis rerum unde sint?",
        },
        { id: "2", name: "SubComponent 2", description: "Description 2" },
      ],
    },
    {
      id: "2",
      name: "Component 2",
      subComponents: [
        { id: "3", name: "SubComponent 3", description: "Description 3" },
        { id: "4", name: "SubComponent 4", description: "Description 4" },
      ],
    },
    {
      id: "3",
      name: "Component 3",
      subComponents: [
        { id: "5", name: "SubComponent 5", description: "Description 5" },
        { id: "6", name: "SubComponent 6", description: "Description 6" },
      ],
    },
    {
      id: "4",
      name: "Component 4",
      subComponents: [
        { id: "7", name: "SubComponent 7", description: "Description 7" },
        { id: "8", name: "SubComponent 8", description: "Description 8" },
      ],
    },
    {
      id: "5",
      name: "Component 5",
      subComponents: [
        { id: "9", name: "SubComponent 9", description: "Description 9" },
        { id: "10", name: "SubComponent 10", description: "Description 10" },
      ],
    },
  ],
};
export default function AssessmentRoadmap() {
  return <div>mmmmmmmmmmmmm</div>;
}
