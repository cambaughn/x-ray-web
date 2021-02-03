import Link from 'next/link';
import Head from '../components/head';
import Nav from '../components/nav';

export default () => (
  <div>
    <Head title="Home" />
    <Nav />
    <div className="hero">
      <h1 className="title">Welcome to Create Next App (Create Next.js App building tools)</h1>
      <p className="description">To get started, edit <code>pages/index.js</code> and save to reload.</p>
      <div className="row">
        <Link href="//nextjs.org/docs/">
          <a className="card">
            <h3>Getting Started &rarr;</h3>
            <p>Learn more about Next.js on official website</p>
          </a>
        </Link>
        <Link href="//github.com/create-next-app/create-next-app">
          <a className="card">
            <h3>Create Next App&rarr;</h3>
            <p>Was this tools helpful?</p>
          </a>
        </Link>
      </div>
    </div>
  </div>
);
