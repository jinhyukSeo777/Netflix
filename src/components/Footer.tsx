import styled from "styled-components";

const CopyRight = styled.span`
  font-size: 16px;
  text-align: center;
  display: block;
  margin: 80px auto;
  margin-top: 100px;
  opacity: 0.8;
`;

const Footer = () => {
  return (
    <CopyRight>
      Copyright &copy; 2022.jinhyukSeo777.All rights reserved
    </CopyRight>
  );
};

export default Footer;
