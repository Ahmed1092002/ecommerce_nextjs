export default function productSellerDetails({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  return "Details about the seller's product";
}
