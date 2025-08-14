"use client";

import { PageContainer } from "../components/PageContainer";
import Collapsible from "./Collapsible";
const data = {
  Capabilities:
    "The quality or state of being capable; the facility, skills, or potential for an indicated use.",
  Compliance:
    "Adherence to organizational policies, procedures, and best practices related to HIE, including standards for data exchange, messaging, and security. It also means adherence to applicable laws, relevant industry standards, and internal policies (e.g., codes of conduct).",
  "Continuous improvement (continual improvement)":
    "Continuous improvement, sometimes called continual improvement, is the ongoing improvement of products, services, or processes through incremental and breakthrough improvements. These efforts can seek “incremental” improvement over time or “breakthrough” improvement all at once.",
  "Decision support":
    "Provides decision makers such as clinicians, staff, patients, policymakers, and other individuals with timely and appropriate information to help inform decisions about health care.",
  "Information system":
    "A collection of technical and human resources that provide the storage, computing, distribution, and communication for the information required by all or some part of the organizational entity (in this case, the health system).",
  Institutionalization:
    "The action of establishing a practice or process as a convention or norm in an organization or culture.",
  "Maturity levels":
    "Consist of a predefined set of process areas. The maturity levels represent the evolutionary path for the domains and subdomains of an HIS, from the lowest levels to the highest. The levels provide a way to characterize HIS performance and progression from one level to the next.",
  "Maturity model":
    "Measures the “as is” status of a process or set of processes, and describes the critical components of a process believed to lead to improved outcomes. The model usually has a certain number of levels that describe the evolution of these processes.",
  "Monitoring and evaluation (M&E)":
    "M&E provides information on what an intervention is doing, how well it is performing, and whether it is achieving its aims and objectives. M&E also tracks inputs, outputs, and processes, and provides guidance on future intervention activities and is an important part of accountability to funding agencies and stakeholders.",
  "National and sub-national offices":
    "Offices and health facilities at all levels of the health system where a particular feature of DHS is expected to be available and functional.",
  Process:
    "A series of actions or steps taken in order to achieve a particular end.",
  "Stages model":
    "A process that happens gradually, involving steps of progressing toward a goal or goals for the purpose of improvement.",
  Technology:
    "The application of scientific knowledge for practical purposes, especially in industry. This includes machinery and equipment developed from the application of scientific knowledge.",
  Uptime: "Time during which a network is operational.",
};

export function Glossary() {
  return (
    <PageContainer pageTitle="Invitations" includeBreadcrumb={false}>
      <div className="w-full flex flex-col gap-6 mt-10 p-5 bg-basic-200 rounded-sm ">
        <h1 className="text-sm font-semibold"> Key Terms / Definition </h1>
        <div className="w-full mx-auto">
          <div className="space-y-3">
            {Object.entries(data).map(([title, content]) => (
              <Collapsible key={title} title={title} content={content} />
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
