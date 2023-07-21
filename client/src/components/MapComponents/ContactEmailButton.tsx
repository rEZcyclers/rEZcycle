import { LocationInfo } from "../../DataTypes";

interface Props {
  activeMarker: LocationInfo;
}

export default function ContactEmailButton({ activeMarker }: Props) {
  const openEmailForm = (loc: LocationInfo) => {
    const recipient = loc.contact;
    const subject = `Enquiry for Donation of ${loc.item}`;
    const body = `Dear ${loc.name},`;
    const emailForm = `mailto:${recipient}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = emailForm;
  };

  return (
    <button
      onClick={() => openEmailForm(activeMarker)}
      style={{
        backgroundColor: "lightgreen",
        color: "green",
        border: "1px solid green",
        borderRadius: 5,
      }}
    >
      Contact via email
    </button>
  );
}
