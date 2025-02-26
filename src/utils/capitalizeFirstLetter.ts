export default function capitalizeFirstLetter(val: any) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}