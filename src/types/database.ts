export interface Database {
  todos: TodosTable;
  users: UsersTable;
  keys: KeysTable;
  sessions: SessionsTable;
}

export interface TodosTable {
  id: string;
  done: boolean;
}

export interface UsersTable {
  id: string;
}

export interface KeysTable {
  id: string;
  user_id: string;
  hashed_password: string | null;
}

export interface SessionsTable {
  id: string;
  user_id: string;
  active_expires: bigint;
  idle_expires: bigint;
}
