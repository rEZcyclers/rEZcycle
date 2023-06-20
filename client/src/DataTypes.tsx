// Custom Data Types based on our Database Schema
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

export type DonateLocation = {
  donate_id: number;
  organisation_name: string;
  address: string;
  contact: string;
  reuse_channel: string;
};

export type RepairLocation = {
  repair_id: number;
  center_name: string;
  stall_number: string;
  repair_type: string;
};

export type DDLoc = {
  dd_id: number;
  donatable_id: number;
  donate_id: number;
};

export type DRLoc = {
  dr_id: number;
  donatable_id: number;
  repair_id: number;
};

export type EDLoc = {
  ed_id: number;
  eWaste_id: number;
  donate_id: number;
};

export type ERLoc = {
  er_id: number;
  eWaste_id: number;
  repair_id: number;
};
