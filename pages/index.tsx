import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { CyclePurchase } from '../components/cycle-purchase'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Sats2Cycles</title>
        <meta name="description" content="Buy Replit cycles using bitcoin" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Sats2Cycles!
        </h1>
        <CyclePurchase />
        <h2 className={styles.description}>
          Tip Replit cycles using bitcoin. Tip your own repl to "buy" cycles.
        </h2>
      </main>

      <footer className={styles.footer}>
        <a
          href="/__repl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Built on Replit
        </a>
      </footer>
    </div>
  )
}

export default Home
