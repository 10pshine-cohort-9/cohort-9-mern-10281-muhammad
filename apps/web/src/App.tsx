import { lazy, Suspense, type ReactElement } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Loading from "./components/Loading";
import Layout from "./layouts/Layout";

import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const NoteCreate = lazy(() => import("./pages/notes/NoteCreate"));
const NoteView = lazy(() => import("./pages/notes/NoteView"));
const NoteEdit = lazy(() => import("./pages/notes/NoteEdit"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App(): ReactElement {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<GuestRoute />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route index element={<Home />} />

            <Route path="n" element={<Navigate to="/" replace />} />

            <Route path="n">
              <Route path="new" element={<NoteCreate />} />
              <Route path=":slug" element={<NoteView />} />
              <Route path=":slug/edit" element={<NoteEdit />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
