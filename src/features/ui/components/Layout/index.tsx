import { Header } from '~/features/ui/components/Header'
// FC - function components

// @ts-ignore // TODO: Add types in TS lesson
export const Layout = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
  </>
)
