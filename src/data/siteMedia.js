import a from "../assets/a.png";
import ar from "../assets/ar.png";
import asiya from "../assets/asiya.png";
import b from "../assets/b.png";
import c from "../assets/c.png";
import f from "../assets/f.png";
import first from "../assets/first.png";
import g from "../assets/g.png";
import h from "../assets/h.png";
import i from "../assets/i.png";
import me from "../assets/me.png";
import mission from "../assets/mission.png";
import nuranova from "../assets/nuranova.png";
import pusi from "../assets/pusi.png";
import s1 from "../assets/s1.png";
import s2 from "../assets/s2.png";
import s3 from "../assets/s3.png";
import vision from "../assets/vision.png";
import { serviceCatalog } from "./services";

const bundledAssets = [
  a,
  ar,
  asiya,
  b,
  c,
  f,
  first,
  g,
  h,
  i,
  me,
  mission,
  nuranova,
  pusi,
  s1,
  s2,
  s3,
  vision,
];

const publicAssets = [
  "/Logo.PNG",
  "/hero/a.png",
  "/hero/b.png",
  "/hero/c.png",
  "/models/camera.glb",
  "/models/IphoneBlack.glb",
  "/services/design.png",
  "/services/education.png",
  "/services/marketing.png",
  "/services/photography.png",
  "/services/software.png",
  "/services/video.png",
];

function getServiceMediaUrls(service) {
  const previewMedia = service.previewMedia ?? { type: "image", src: service.image };

  return [service.image, previewMedia.src, previewMedia.poster].filter(Boolean);
}

export const siteMediaManifest = Array.from(
  new Set([...bundledAssets, ...publicAssets, ...serviceCatalog.flatMap(getServiceMediaUrls)])
);
