// Custom Data Types based on our Database Schema
export type UserProfile = {
  user_id: number;
  email: string;
  name: string;
  phone: string;
  region: string;
}

export type RecyclableItem = {
  recyclable_id: number;
  material: string;
  name: string;
  bluebin_eligibility: number;
  checklist: string;
};

export type DonatableItem = {
  donatable_id: number;
  donatable_type: string;
  description: string;
};

export type EWasteItem = {
  eWaste_id: number;
  eWaste_type: string;
  description: string;
};

export type DonateOrganisation = {
  donateOrg_id: number;
  organisation_name: string;
  reuse_channel: string;
}

export type DonateLocation = {
  donateLoc_id: number;
  donateOrg_id: number;
  location_name: string;
  address: string;
  contact: string;
};

export type RepairLocation = {
  repair_id: number;
  center_name: string;
  stall_number: string;
  repair_type: string;
};

export type DDOrg = {
  dd_id: number;
  donatable_id: number;
  donateOrg_id: number;
};

export type DRLoc = {
  dr_id: number;
  donatable_id: number;
  repair_id: number;
};

export type EDOrg = {
  ed_id: number;
  eWaste_id: number;
  donateOrg_id: number;
};

export type ERLoc = {
  er_id: number;
  eWaste_id: number;
  repair_id: number;
};

export type item = {
  category: number;
  condition: number;
  index: number;
}
