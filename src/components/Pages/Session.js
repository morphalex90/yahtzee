import React from 'react';

import Header from './../Layout/Header';
import Footer from './../Layout/Footer';

// import ApolloClient from "apollo-boost";
// import { ApolloProvider } from "react-apollo";

// const client = new ApolloClient({
//     uri: "http://wordpress.local/graphql"
// });

const Session = (props) => (
    <React.Fragment>
        <Header />
        <main>
            <div className="container">
                <div>Single session</div>
                <div>{props.match.params.session}</div>
            </div>
        </main>
        <Footer />
    </React.Fragment>
    // <ApolloProvider client={client}>
    //     <div className="container">
    //         <div className="row">
    //             <Pages />
    //         </div>
    //     </div>
    // </ApolloProvider>
);

export default Session;