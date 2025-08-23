// // src/components/EventList.tsx
// import React from "react";
// import { Event } from "../api/eventApi";

// interface Props {
//   events: Event[];
// }

// const EventList: React.FC<Props> = ({ events }) => {
//   return (
//     <div>
//       {events.length === 0 ? (
//         <p>No events available</p>
//       ) : (
//         <ul className="space-y-4">
//           {events.map((event) => (
//             <li key={event._id} className="p-4 border rounded">
//               <h2 className="text-lg font-semibold">{event.title}</h2>
//               <p>{event.description}</p>
//               <span className="text-sm text-gray-600">
//                 {new Date(event.date).toDateString()}
//               </span>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default EventList;
