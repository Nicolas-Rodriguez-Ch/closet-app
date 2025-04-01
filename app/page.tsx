export default async function Home() {
  const response = await fetch('http://localhost:3000/api/apparel');
  console.log('Esto es response: ', response.status);
  return (
    <article>
      <h1 className='bg-palette-1 text-palette-3'>Esto es home</h1>{' '}
    </article>
  );
}
