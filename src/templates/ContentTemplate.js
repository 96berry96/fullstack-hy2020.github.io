import './ContentTemplate.scss';

import path from 'path';

import { graphql } from 'gatsby';
import Parser from 'html-react-parser';
import domToReact from 'html-react-parser/lib/dom-to-react';
import React, { Component } from 'react';

import colors from '../colors';
import Arrow from '../components/Arrow/Arrow';
import { Banner } from '../components/Banner/Banner';
import Footer from '../components/Footer/Footer';
import Layout from '../components/layout';
import PrevNext from '../components/PrevNext/PrevNext';
import ReturnInfo from '../components/ReturnInfo/ReturnInfo';
import ScrollNavigation from '../components/ScrollNavigation/ScrollNavigation';
import { SubHeader } from '../components/SubHeader/SubHeader';

export default class ContentTemplate extends Component {
  componentDidMount() {
    const links = Array.from(document.querySelectorAll('a'));
    const { frontmatter } = this.props.data.markdownRemark;

    links.map(i => {
      return (i.style = `border-color: ${colors[frontmatter.partColor]}`);
    });
  }

  render() {
    const { markdownRemark } = this.props.data;
    const { frontmatter, html } = markdownRemark;
    const { mainImage, title, subTitle, letter, part, partColor } = frontmatter;
    const colorCode = colors[partColor];

    const parserOptions = {
      replace: ({ type, name, attribs, children }) => {
        if (type === 'tag' && name === 'picture') {
          return (
            <picture>
              <img
                style={{ borderColor: colorCode }}
                alt="fullstack content"
                src={children[0].attribs.src}
              />
            </picture>
          );
        } else if (type === 'tag' && name === 'pre') {
          return <pre>{domToReact(children, parserOptions)}</pre>;
        } else if (type === 'tag' && attribs.class === 'content') {
          return (
            <div className="container">
              <div className="course-content col-7 push-right-3">
                {domToReact(children, parserOptions)}
              </div>
            </div>
          );
        } else if (type === 'tag' && attribs.class === 'tasks') {
          return (
            <Banner
              style={{
                backgroundColor: colorCode,
              }}
              className="spacing spacing--after"
            >
              <div className="container">
                <div
                  className="course-content col-7 push-right-3"
                  style={{ borderColor: colorCode }}
                >
                  {children.name === 'pre' ? (
                    <pre>{domToReact(children, parserOptions)}</pre>
                  ) : (
                    domToReact(children, parserOptions)
                  )}
                </div>
              </div>
            </Banner>
          );
        }
        return;
      },
    };

    return (
      <Layout>
        <div className="spacing--small spacing--after">
          <div className="course-container">
            <Banner
              backgroundColor={colorCode}
              className="spacing--after"
              style={{
                backgroundImage: `url(${path.resolve(mainImage.publicURL)})`,
                backgroundPosition: 'center center',
                backgroundSize: '80%',
                backgroundRepeat: 'no-repeat',
                backgroundColor: colorCode,
              }}
            >
              <div className="container">
                <Arrow
                  upperCase
                  content={[
                    {
                      backgroundColor: colorCode,
                      text: 'Fullstack',
                      link: '/about',
                    },
                    {
                      backgroundColor: colorCode,
                      text: title,
                      link: `/osa${part}`,
                    },
                    {
                      backgroundColor: 'black',
                      text: subTitle,
                    },
                  ]}
                />
              </div>
            </Banner>
            <div className="course">
              <div className="container">
                <div className="col-7 course-content push-right-3">
                  <p
                    className="col-1 letter"
                    style={{ borderColor: colorCode }}
                  >
                    {letter}
                  </p>
                  <SubHeader headingLevel="h1" text={subTitle} />
                </div>

                <ScrollNavigation
                  part={part}
                  letter={letter}
                  currentPartTitle={subTitle}
                  currentPath={frontmatter.path}
                  className="col-2"
                />
              </div>
              {Parser(html, parserOptions)}
            </div>

            <ReturnInfo />

            <PrevNext
              prev={part > 0 ? part - 1 : undefined}
              next={part < 8 ? part + 1 : undefined}
            />
          </div>
        </div>

        <Footer />
      </Layout>
    );
  }
}

export const contentPageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        title
        subTitle
        path
        mainImage {
          publicURL
        }
        partColor
        part
        letter
      }
    }
  }
`;
