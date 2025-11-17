import React from "react";
import './userList.css'


interface Column<T> {
  label: string;
  render: (item: T) => React.ReactNode;
  width?: string;
}

interface AdminListProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
}

const AdminList = <T extends { _id: string }>({
  title,
  data,
  columns,
  page,
  totalPages,
  onPrev,
  onNext,
  searchTerm,
  onSearchChange,
  onSearchSubmit,
}: AdminListProps<T>) => {
  return (
    <div className="admin-list">
      <h2>{title}</h2>

      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearchSubmit();
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search by name or email"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-box"
        />
        <button type="submit">Search</button>
      </form>

      {/* Table */}
      <table>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              {columns.map((col, idx) => (
                <td key={idx}>{col.render(item)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={onPrev} disabled={page === 1}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={onNext} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminList;
