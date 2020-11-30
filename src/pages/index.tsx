import React from "react"

import { IconContext } from "react-icons";
import { FaLinkedin, FaGithubSquare } from "react-icons/fa";

import Layout from "../components/layout"

const IndexPage = () =>
  <Layout>
    <section>
      <h2>Software Engineer </h2>

      <IconContext.Provider value={{style: {verticalAlign: "-0.1em"}}}>
        <table>
          <tbody>
            <tr>
              <td>
                <a href="https://www.linkedin.com/in/matthew-mazzanti-b4679211a">
                  LinkedIn
                  <FaLinkedin/>
                </a>
              </td>

              <td>
                <a href="https://github.com/matthewmazzanti">
                  GitHub
                  <FaGithubSquare/>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </IconContext.Provider>

      <table>
        <tbody>
          <tr>
            <td align="right">Address:</td>
            <td>19305 Tattershall Drive, Germantown. MD 20874</td>
          </tr>
          <tr>
            <td align="right">E-mail:</td>
            <td>matthew.mazzanti@gmail.com</td>
          </tr>
          <tr>
            <td align="right">Phone:</td>
            <td>(240)855-6586</td>
          </tr>
        </tbody>
      </table>

      <p>
        I'm looking for an position that will allow me to work on a team of
        talented people that I can learn from, continue to expand my knowledge
        with, and take the things I've learned in school, previous work, and on
        my own and apply it to solve new and interesting real world problems.
        I love solving challenging problems, figuring out how things work, and
        understanding technology. Serious Linux nerd and Python devotee. Things
        I'm passionate about: full stack development, UI/UX design, cloud
        based/scalable architecture design, data science, and machine learning.
      </p>
    </section>

    <section>
      <h2>Skills</h2>
      <ul>
        <li>Python</li>
        <li>Angular/React</li>
        <li>JavaScript</li>
        <li>Linux/SysAdmin</li>
        <li>GoLang</li>
        <li>AWS</li>
        <li>HTML/CSS</li>
        <li>Haskell</li>
        <li>C/C++</li>
        <li>SQL</li>
        <li>TCP/Networking</li>
        <li>Java</li>
      </ul>
    </section>

    <section>
      <h2>Experience</h2>
      <h3>Welgo, Inc.</h3>
      <p>Feb 2020 to Now</p>
      <p>
        Helped to bring a faltering product to market, rebuilding and
        refining critical systems such as devops, frontend, and backend while
        under tight timelines. I brought the scattered pieces into a single
        monorepo, created a cutting edge build and deployment system, and
        worked tirelessly to iterate and improve upon the system. Over the
        course of two months, the product went from a proof of concept to a
        real deployed system, used every day by physicians in Maryland.

        Hightlights:
      </p>
      <ul>
        <li>
          <b>AWS containerized services</b> - Shifted from an unrefined,
          ad-hoc EC2 deployment system to a stable and highly available
          container based system hosted in ECS.
        </li>

        <li>
          <b>Devops/Continuous integration</b> - Completely retooled the
          build system to facilitate auto triggered reproducable builds and
          deployments using AWS CodeBuild and CodeDeploy.
        </li>

        <li>
          <b>UI/UX design</b> - Built and maintained multiple websites
          with both Angular and React frontends, rebuilding and
          rearchitecting the systems so that they became more reliable,
          faster, and easier to use.
        </li>

        <li>
          <b>Tight timelines</b> - As an early-stage startup, all of the
          work was done under incredibly tight timelines, with little
          tolerance for downtime. A major focus of the design and
          deployment was ensuring that everything was done in a way to
          maximize output and results, while being quick to bugfix and
          redeploy if problems arose.
        </li>

        <li>
          <b>Reverse engineering</b> - Left with little documentation, I had
          to reverse engineer thousands of lines of code in order to improve
          and extend services.
        </li>
      </ul>

      <h3>AT&T Chief Security Office</h3>
      <p>Jun 2019 to Feb 2020</p>
      <p>
        Focused on command-line data manipulation tools, I brought my
        knowledge of compter science and UX design to make manipulating data
        easy and simple for security researchers at AT&T. Within my team,
        I was a valuable source of advice and guidance on all things
        technical, where I was often turned to for advice on architecture,
        technologies, or just general programming help.

        Hightlights:
      </p>
      <ul>
        <li>
          <b>Linux sysadmin</b> - Built out and self-hosted the needed
          development infrastructure, such as hosted git repositories,
          continous integration, and sandboxed development environments.
        </li>

        <li>
          <b>Devops/Continuous integration</b> - From day 1, I pushed for
          continuous integration and testing within the team, dramatically
          increasing developer productivity and code correctness.
        </li>

        <li>
          <b>Software architecture</b> - I was often seeked out to help in
          designing and architecturing systems - even those I was not
          directly working on. I helped elevate many of the developers within
          the team, spending many hours working closely with team members to
          facilitate deep understanding of the systems we were working with.
        </li>

        <li>
          <b>Developer advocate</b> - In addition to helping developers I
          also played a customer facing role where I demoed and explained the
          technologies we were building, provided direction and suggestions
          to our researchers on what features were possible and the timelines
          different approaches would take, and played a key role in creating
          implementation plans we followed for bringing our products to life.
        </li>

        <li>
          <b>Data analytics</b> - A primary focus of our work was on
          data analytics, where I used my past experience with Python, and
          new experience with Golang, to create fast and easy to use tools for
          processing big data.
        </li>
      </ul>

      <h3>Trushield Inc.</h3>
      <p>Jun 2018 to Dec 2018</p>
      <p>
        Worked to re-architect and re-implement an email phishing learning and
        analysis tool called Phishield to improve it in nearly every measurable
        aspect.

        Hightlights:
      </p>

      <ul>
        <li>
          <b>Reverse engineering</b> - Inherited code from previous team and
          had to learn it without training and documentation.
        </li>

        <li>
          <b>Architecture design</b> - Redesigned the architecture so that it
          was more flexible and understandable. Brought the project size down
          from over 5000 lines to under 2000.
        </li>

        <li>
          <b>Optimization</b> - Used Numpy to improve times on data
          de-duplication for csv files from over 10+ minutes to less than 15
          seconds. Shifted from MySql to Postgres to allow for in-place upserts
          to allow new data to be added or old data to be changed without
          having to make a full loop from SQL to Python and back.
        </li>

        <li>
          <b>UI/UX design</b> - Worked with users to redesign workflows to
          reduce complexity. Used templates and per-page analysis to decrease
          page loading/rendering times for a smoother user experience. Improved
          overall look and feel of the site.
        </li>

        <li>
          <b>Data analysis and visualization</b> - Reworked the data
          visualization workflow to rely more upon back-end rendering, allowing
          visualizations to be faster and cached for better performance, and
          improved UX by increasing clarity.
        </li>

        <li>
          <b>Quality assurance</b> - Wrote scripts to separate testing data
          from real data in the server.
        </li>

        <li>
          <b>AWS server management</b> - Managed migration between RHEL 6
          instance to new Amazon Linux instance. Did cost-benefit analysis of
          using outside services vs boot-strapping them on the EC2 instances.
        </li>
      </ul>
    </section>
    <section>
      <h2>Education</h2>
      <h3>University of Maryland, College Park</h3>
      <p>Aug 2015 to May 2019 - Computer Science</p>

      <p>Study concentration:</p>
      <ul>
        <li>Software development</li>
        <li>Computer networking</li>
        <li>Data analysis</li>
        <li>Machine learning</li>
        <li>Database design</li>
      </ul>
    </section>
  </Layout>;

  export default IndexPage
