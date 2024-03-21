import BottomSidebar from './BottomSidebar';
import SettingsSidebar from './SettingsSidebar';
import ProjectSidebar from './ProjectSidebar';

export const initialProjectSidebar = {
  show: true, component: ProjectSidebar,
};

export const initialSettingsSidebar = {
  show: false, component: SettingsSidebar,
};

export const initialBottomSidebar = {
  show: false, component: BottomSidebar,
};