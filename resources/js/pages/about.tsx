type AboutProps = {
  name: string
}

const About: React.FC<AboutProps> = ({ name }) => {
  return (
    <>
      
      <h1>Hello World!</h1>
      <p>Hello {name} !</p>
    </>
  );
}

export default About;