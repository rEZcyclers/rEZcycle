////////// Custom Data Types based on our Database Schema //////////

// User Profile info + picture
export type UserProfile = { 
  user_id: number;
  email: string;
  name: string;
  phone: string;
  region: string;
  dp_url: string;
}


// All items to be recycled/donated/repaired
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

export type EwasteItem = {
  ewaste_id: number;
  ewaste_type: string;
  description: string;
  is_regulated: boolean;
  remarks: string;
};


// All locations for the items to be recycled/donated/repaired

export type Bluebin = {
  bluebin_id: number;
  address: string;
  latitude: number;
  longitude: number;
}

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
  latitude: number;
  longitude: number;
};

export type RepairLocation = {
  repair_id: number;
  center_name: string;
  stall_number: string;
  repair_type: string;
  latitude: number;
  longitude: number;
};

export type Ebin = {
  ebin_id: number;
  ebin_name: string;
  website: string;
}

export type EbinLocation = {
  ebinLoc_id: number;
  ebin_id: number;
  location: string;
  address: string;
  postal_code: number;
  latitude: number;
  longitude: number;
}


// All junction tables required for many-to-many relations as mentioned in schema
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
  ewaste_id: number;
  donateOrg_id: number;
};

export type ERLoc = {
  er_id: number;
  ewaste_id: number;
  repair_id: number;
};

export type EE = {
  ee_id: number;
  ewaste_id: number;
  ebin_id: number;
}


// Selected Item based on User Queries 
export type SelectedResultItem = {
  category: number
  index: number;
  condition: number;
}

// Wrapper object to store a donateOrganisation & its corresponding list of outlet locations
export type DonateOrganisationLocations = {
  donateOrg: DonateOrganisation;
  donateLocations: DonateLocation[];
};

// Wrapper object to store an ebin object & its corresponding list of locations
export type EbinLocations = {
  ebin: Ebin;
  ebinLocations: EbinLocation[];
};


export type LocationInfo = {
  locationType: string;
  name: string;
  address: string;
  contact: string;
  lat: number;
  lng: number;
};

