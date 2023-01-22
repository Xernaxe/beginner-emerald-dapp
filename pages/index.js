import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Nav from '../components/Nav.jsx';
import { useState, useEffect } from 'react';
import * as fcl from '@onflow/fcl';

export default function Home() {
	const [newGreeting, setNewGreeting] = useState('');

	const [greeting, setGreeting] = useState('');
	async function executeScript() {
		const response = await fcl.query({
			cadence: `
      import HelloWorld from 0xc51d4b93776871fd
  
      pub fun main(): String {
          return HelloWorld.greeting
      }
      `,
			args: (arg, t) => [], // ARGUMENTS GO IN HERE
		});
		setGreeting(response);
		console.log('Response from our script: ' + response);
	}

	async function executeScript2() {
		const response = await fcl.query({
			cadence: `
      import SimpleTest from 0x6c0d53c676256e8c
  
      pub fun main(): Int {
          return SimpleTest.number
      }
      `,
			args: (arg, t) => [], // ARGUMENTS GO IN HERE
		});
		console.log('Response from our script: ' + response);
	}

	async function executeScript3() {
		const response = await fcl.query({
			cadence: `
      pub fun main(
        a: Int, 
        b: String, 
        c: UFix64, 
        d: Address, 
        e: Bool,
        f: String?,
        g: [Int],
        h: {String: Address}
      ): AnyStruct{
        return b
      }
      `,
			args: (arg, t) => [
				arg('22', t.Int),
				arg('Snus is so expensive now, unbeliveble', t.String),
				arg('5.9', t.UFix64),
				arg('0x6c0d53d321256e8c', t.Address),
				arg(true, t.Bool),
				arg(null, t.Optional(t.String)),
				arg([1, 2, 7], t.Array(t.Int)),
				arg(
					[
						{ key: 'FLOAT', value: '0x2d4c3caffbeab845' },
						{ key: 'EmeraldID', value: '0x39e42c67cc851cfb' },
					],
					t.Dictionary({ key: t.String, value: t.Address })
				),
			],
		});
		console.log(response);
	}

	async function runScript() {
		const response = await fcl.query({
			cadence: `
      import SimpleTest from 0x6c0d53c676256e8c
      pub fun main(): Int {
        return SimpleTest.number
      }
      `,
			args: (arg, t) => [],
		});
		console.log(response);
	}

	const [newNumber, setNewNumber] = useState('');
  const [txStatus, setTxStatus] = useState('')

	async function runTransaction() {
		const transactionId = await fcl.mutate({
			cadence: `
      import SimpleTest from 0x6c0d53c676256e8c 
      transaction(myNewNumber: Int) {
        prepare(signer: AuthAccount) {}
        execute {
          SimpleTest.updateNumber(newNumber: myNewNumber)
        }
      }
      `,
			args: (arg, t) => [arg(newNumber, t.Int)],
			proposer: fcl.authz,
			payer: fcl.authz,
			authorizations: [fcl.authz],
			limit: 999,
		});

		console.log('Here is the transactionId: ' + transactionId);
    fcl.tx(transactionId).subscribe(res => {
      console.log(res);
      if (res.status === 0 || res.status === 1) {
        setTxStatus('Pending...');
      } else if (res.status === 2) {
        setTxStatus('Finalized...')
      } else if (res.status === 3) {
        setTxStatus('Executed...');
      } else if (res.status === 4) {
        setTxStatus('Sealed!');
        setTimeout(() => setTxStatus('Run Transaction'), 2000)
      }
    })
		await fcl.tx(transactionId).onceSealed();
    
		runScript();
	}

	useEffect(() => {
		// executeScript()
		// executeScript2()
		executeScript3();
	}, []);

	return (
		<div className={styles.container}>
			<Head>
				<title>Emerald DApp</title>
				<meta name="description" content="Created by Emerald Academy" />
				<link rel="icon" href="https://i.imgur.com/hvNtbgD.png" />
			</Head>

			<Nav />
			<div className={styles.welcome}>
				<h1 className={styles.title}>
					Welcome to my{' '}
					<a href="https://academy.ecdao.org" target="_blank">
						Emerald DApp!
					</a>
				</h1>
				<p>
					This is a DApp created by Jacob Tucker (<i>tsnakejake#8364</i>).
				</p>
			</div>

			<main className={styles.main}>
				<p>{greeting}</p>
				<div className={styles.flex}>
					<input
						onChange={(e) => setNewGreeting(e.target.value)}
						placeholder="Hello, Idiots!"
					/>
					<button onClick={runTransaction}>{txStatus}</button>
				</div>
			</main>
		</div>
	);
}
