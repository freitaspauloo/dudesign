import { homeFeaturedProjects } from "@/src/content/home";
import { FrameWorkGrid } from "./FrameWorkGrid";

export function HomeFeaturedWork() {
  return <FrameWorkGrid projects={homeFeaturedProjects} />;
}
