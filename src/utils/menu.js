// import { ReactComponent as CompareIcon } from "assets/svgs/compare.svg";
// import { ReactComponent as ConnectionIcon } from "assets/svgs/link.svg";
// import { ReactComponent as DataSetIcon } from "assets/svgs/dataset.svg";
// import { ReactComponent as DeployIcon } from "assets/svgs/Deploy.svg";
// import { ReactComponent as FeaturesIcon } from "assets/svgs/Feature.svg";

import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
// import { ReactComponent as ModelsIcon } from "assets/svgs/Models.svg";
// import { ProjectContext } from "context/ProjectContextProvider";
// import { ReactComponent as SavedModelsIcon } from "assets/svgs/SavedModels.svg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useContext } from "react";
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import FlatwareIcon from '@mui/icons-material/Flatware';
import DeckIcon from '@mui/icons-material/Deck';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ColorLensIcon from '@mui/icons-material/ColorLens';

export default function useSideBarMenu() {
  // const { selectedProjectId } = useContext(ProjectContext);


  var menu = [
    // {
    //   icon: FlatwareIcon,
    //   title: "Orders",
    //   to: "/orders",
    //   items: [],
    // },    
    {
      icon: DeckIcon,
      title: "Tables",
      to: "/tables",
      items: [],
      showToPorters: true
    },   
    {
      icon: RestaurantMenuIcon,
      title: "Menu Items",
      to: "/menuitems",
      items: [],
      showToPorters: true
    },
    {
      icon: FollowTheSignsIcon,
      title: "Porters",
      to: "/porters",
      items: [],
      showToPorters: false
    },
    {
      icon: SettingsApplicationsIcon,
      title: "Configuration",
      to: "/configure",
      items: [],
      showToPorters: false
    },
    {
      icon: RestaurantIcon,
      title: "View orders",
      to: "/orders",
      items: [],
      showToPorters: true
    },
    {
      icon: FastfoodIcon,
      title: "Food Category",
      to: "/foodCategory",
      items: [],
      showToPorters: true
    },
    {
      icon: ColorLensIcon,
      title: "Configure Themes",
      to: "/configureThemes",
      items: [],
      showToPorters: false
    },
  ];

  if (localStorage.getItem("porter-id")) {
    menu = menu.filter(a=>a.showToPorters === true)
  }
  return menu;
}
