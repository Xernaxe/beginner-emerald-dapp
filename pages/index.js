import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  function printHello(){
    console.log('Hi');
  }
  function printBye(){
    console.log('Bye');
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Emerald DApp</title>
        <meta name="description" content="Created by Emerald Academy" />
        <link rel="icon" href="https://i.imgur.com/hvNtbgD.png" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to my <a href="https://github.com/Xernaxe" target="_blank">Emerald DApp!</a>
        </h1>
        <p>Some text</p>
        <div className={styles.flex}>
        <button onClick={printHello}>Hello</button>
        <button onClick={printBye}>Goodbye</button>

        </div>
      </main>
    </div>
  )
}