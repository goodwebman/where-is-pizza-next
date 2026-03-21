import styles from './layout.module.scss';
export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className={styles.layout}>{children}</section>;
}
