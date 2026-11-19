const { useState, useEffect, useRef } = React;

const emptyUser = {
  name: "", username: "", email: "", phone: "", website: "",
  address: { street: "", suite: "", city: "" },
};

const fields = [
  ["name", "Họ và tên"], ["username", "Tên đăng nhập"],
  ["email", "Email", "email"], ["phone", "Điện thoại", "tel"],
  ["street", "Đường"], ["suite", "Căn hộ"], ["city", "Thành phố"],
  ["website", "Website"],
];

function SearchForm({ onChangeValue }) {
  return (
    <label className="search">
      Tìm người dùng
      <input type="search" placeholder="Họ tên hoặc tên đăng nhập"
        onChange={event => onChangeValue(event.target.value)} />
    </label>
  );
}

function UserForm({ title, submitLabel, initialUser, onSave, onCancel }) {
  const dialog = useRef(null);
  const [draft, setDraft] = useState(initialUser);
  const [error, setError] = useState("");

  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    return () => element.close();
  }, []);

  function update(field, value) {
    setDraft(previous => Object.hasOwn(emptyUser.address, field)
      ? { ...previous, address: { ...previous.address, [field]: value } }
      : { ...previous, [field]: value });
  }

  function submit(event) {
    event.preventDefault();
    const name = draft.name.trim();
    const username = draft.username.trim();
    if (!name || !username) {
      setError("Vui lòng nhập họ tên và tên đăng nhập.");
      return;
    }
    onSave({ ...draft, name, username });
  }

  return (
    <dialog ref={dialog} aria-label={title} onCancel={onCancel}>
      <h2>{title}</h2>
      <form onSubmit={submit}>
        <div className="fields">
          {fields.map(([field, label, type = "text"]) => (
            <label key={field}>
              {label}
              <input type={type} value={draft.address[field] ?? draft[field] ?? ""}
                required={field === "name" || field === "username"}
                onChange={event => update(field, event.target.value)} />
            </label>
          ))}
        </div>
        {error && <p role="alert">{error}</p>}
        <div className="actions">
          <button type="button" className="secondary" onClick={onCancel}>Hủy</button>
          <button type="submit">{submitLabel}</button>
        </div>
      </form>
    </dialog>
  );
}

function AddUser({ onAdd }) {
  const [adding, setAdding] = useState(false);
  return (
    <div>
      <button onClick={() => setAdding(true)}>Thêm người dùng</button>
      {adding && <UserForm title="Thêm người dùng" submitLabel="Thêm" initialUser={emptyUser}
        onCancel={() => setAdding(false)}
        onSave={user => { onAdd(user); setAdding(false); }} />}
    </div>
  );
}

function ResultTable({ keyword, user, onAdded }) {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const request = new AbortController();
    fetch("https://jsonplaceholder.typicode.com/users", { signal: request.signal })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(data => setUsers(previous => [...data, ...previous]))
      .catch(() => {
        if (!request.signal.aborted) setError("Không thể tải danh sách mẫu. Hãy tải lại trang để thử lại.");
      })
      .finally(() => {
        if (!request.signal.aborted) setLoading(false);
      });
    return () => request.abort();
  }, []);

  useEffect(() => {
    if (!user) return;
    // IDs for local additions cannot collide with numeric IDs from the API.
    const added = { ...user, id: crypto.randomUUID() };
    setUsers(previous => [...previous, added]);
    onAdded();
  }, [user, onAdded]);

  const query = keyword.trim().toLowerCase();
  const filteredUsers = users.filter(entry =>
    entry.name.toLowerCase().includes(query) || entry.username.toLowerCase().includes(query));

  return (
    <>
      {error && <p role="alert">{error}</p>}
      <p className="status" role="status">
        {loading ? "Đang tải danh sách…" : `${filteredUsers.length} người dùng`}
      </p>
      <div className="table-scroll" role="region" aria-label="Danh sách người dùng" tabIndex="0">
        <table>
          <thead>
            <tr>{["ID", "Họ và tên", "Tên đăng nhập", "Email", "Địa chỉ", "Điện thoại", "Thao tác"]
              .map(label => <th scope="col" key={label}>{label}</th>)}</tr>
          </thead>
          <tbody>
            {filteredUsers.map(entry => (
              <tr key={entry.id}>
                <td>{typeof entry.id === "number" ? entry.id : entry.id.slice(0, 8)}</td>
                <td>{entry.name}</td>
                <td>{entry.username}</td>
                <td>{entry.email || "—"}</td>
                <td>{[entry.address.street, entry.address.suite, entry.address.city].filter(Boolean).join(", ") || "—"}</td>
                <td>{entry.phone || "—"}</td>
                <td className="row-actions">
                  <button className="secondary" aria-label={`Sửa ${entry.name}`}
                    onClick={() => setEditing({ ...entry, address: { ...entry.address } })}>Sửa</button>
                  <button className="delete" aria-label={`Xóa ${entry.name}`}
                    onClick={() => setUsers(previous => previous.filter(item => item.id !== entry.id))}>Xóa</button>
                </td>
              </tr>
            ))}
            {!loading && !filteredUsers.length && (
              <tr><td colSpan="7">Không có người dùng phù hợp.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {editing && <UserForm title="Sửa người dùng" submitLabel="Lưu" initialUser={editing}
        onCancel={() => setEditing(null)}
        onSave={updated => {
          setUsers(previous => previous.map(entry => entry.id === updated.id ? updated : entry));
          setEditing(null);
        }} />}
    </>
  );
}

function App() {
  const [kw, setKeyword] = useState("");
  const [newUser, setNewUser] = useState(null);
  const clearNewUser = React.useCallback(() => setNewUser(null), []);

  return (
    <main>
      <a href="../">← Trang bài tập</a>
      <h1>Quản lý người dùng</h1>
      <div className="toolbar">
        <SearchForm onChangeValue={setKeyword} />
        <AddUser onAdd={setNewUser} />
      </div>
      <ResultTable keyword={kw} user={newUser} onAdded={clearNewUser} />
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
