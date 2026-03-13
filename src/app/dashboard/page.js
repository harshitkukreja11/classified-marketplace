import { listings } from "@/data/listings";

export default function Dashboard() {

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        My Listings
      </h1>

      <table className="w-full border">

        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Title</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {listings.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{item.title}</td>
              <td>AED {item.price}</td>
              <td>Active</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}