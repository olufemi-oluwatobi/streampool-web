import React from "react";
import { FC } from "react";
import { connect } from "react-redux";
import Layout from "../components/Layout";
import withAuth from "../utils/auth/withAuth";
import Head from "next/head";

import { handleFetchGiftCards, stageGiftCard } from "../store/actions";

import { ThunkActionResponse } from "../interfaces";

interface Props {
    getGiftCards: (d?: { [key: string]: string }) => ThunkActionResponse;
    selectGiftCard: (id: number | string) => void;
}

const IndexPage: FC<Props> = ({ }) => {
    return (
        <div className="  ">
            <Head>
                <title>Digiftng</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Layout title="Business">
                <div className="  px-[7.5%] py-28 ">
                    <p>
                        <span className="term_and_condition_point">1. Introduction:</span>{" "}
                        Welcome to&#160;Blinksky Nigeria Limited, owners of
                        www.digiftng.com&#160;(&ldquo;Company&rdquo;, &ldquo;we&rdquo;,
                        &ldquo;our&rdquo;, &ldquo;us&rdquo;)! As you have just clicked our
                        Terms of Service, please pause, grab a cup of coffee and carefully
                        read the following pages. It will take you approximately
                        20&#160;minutes.
                    </p>

                    <p>
                        These Terms of Service (&ldquo;Terms&rdquo;, &ldquo;Terms of
                        Service&rdquo;) govern your use of&#160;our web pages located at
                        www.digiftng.com&#160;operated by&#160;Blinksky Nigeria Limited. Our
                        Privacy Policy also governs your use of our Service and explains how
                        we collect, safeguard and disclose information that results from
                        your use of our web pages. Please read it here
                        www.digiftng.com/privacy.
                    </p>

                    <p>
                        Your agreement with us includes these Terms&#160;and our Privacy
                        Policy&#160;(&ldquo;Agreements&rdquo;). You acknowledge that you
                        have read and understood Agreements, and agree to be bound of them.
                        If you do not agree with (or cannot comply with) Agreements, then
                        you may not use the Service, but please let us know by emailing at
                        hello@digiftng.com so we can try to find a solution. These Terms
                        apply to all visitors, users and others who wish to access or use
                        Service. Thank you for being responsible.
                    </p>

                    <p>
                        <span className="term_and_condition_point">
                            2. Communications: By using our Service
                        </span>
                        , you agree to subscribe to newsletters, marketing or promotional
                        materials and other information we may send. However, you may opt
                        out of receiving any, or all, of these communications from us by
                        following the unsubscribe link or by emailing at.
                    </p>

                    <p>
                        <span className="term_and_condition_point">3. Purchases:</span> If
                        you wish to purchase any product made available through the Service
                        (&ldquo;Purchase&rdquo;), you may be asked to supply certain
                        information relevant to your Purchase including, without limitation,
                        your Bank Verification Number, your credit/Debit card number, the
                        expiration date of your credit/Debit card, and your&#160; address.
                        You represent and warrant that:
                        <ul>
                            <li>
                                (i) you have the legal right to use any credit /Debit card(s) or
                                other payment method(s) in connection with any Purchase; and
                                that
                            </li>
                            <li>
                                (ii) the information you supply to us is true, correct and
                                complete. We may employ the use of third-party services for the
                                purpose of facilitating payment and the completion of Purchases.
                                By submitting your information, you grant us the right to
                                provide the information to these third parties&#160;subject to
                                our Privacy Policy. We reserve the right to refuse or cancel
                                your order at any time for reasons including but not limited to:
                                product availability, errors in the description or price of the
                                product, error in your order or other reasons. We reserve the
                                right to refuse or cancel your order if fraud or an unauthorized
                                or illegal transaction is suspected.
                            </li>
                        </ul>
                    </p>

                    <p>
                        {" "}
                        <span className="term_and_condition_point">4. Refund:</span> We
                        issue refunds for Giftcards purchased on a case by case basis, all
                        approved refunds would be processed into your Digiftng Wallet within
                        24hrs from the day of approval. However, all Giftcards purchased
                        that have been activated by the customer wouldn&rdquo;t be eligible
                        for refunds.
                    </p>

                    <p>
                        {" "}
                        <span className="term_and_condition_point">
                            5. Prohibited Uses:
                        </span>{" "}
                        You may use Service only for lawful purposes and in accordance with
                        Terms. You agree not to use Service:
                        <ul>
                            <li>
                                {" "}
                                (a) In any way that violates any applicable national or
                                international law or regulation.
                            </li>
                            <li>
                                {" "}
                                (b) For the purpose of exploiting, harming, or attempting to
                                exploit or harm minors in any way by exposing them to
                                inappropriate content or otherwise.
                            </li>
                            <li>
                                {" "}
                                (b) For the purpose of exploiting, harming, or attempting to
                                exploit or harm minors in any way by exposing them to
                                inappropriate content or otherwise.
                            </li>
                            <li>
                                (c) To transmit, or procure the sending of, any advertising or
                                promotional material, including any &ldquo;junk mail&rdquo;,
                                &ldquo;chain letter,&rdquo; &ldquo;spam,&rdquo; or any other
                                similar solicitation.
                            </li>
                            <li>
                                {" "}
                                (d) To impersonate or attempt to impersonate Company, a Company
                                employee, another user, or any other person or entity. (e) In
                                any way that infringes upon the rights of others, or in any way
                                is illegal, threatening, fraudulent, or harmful, or in
                                connection with any unlawful, illegal, fraudulent, or harmful
                                purpose or activity.
                            </li>
                            <li>
                                {" "}
                                (d) To impersonate or attempt to impersonate Company, a Company
                                employee, another user, or any other person or entity. (e) In
                                any way that infringes upon the rights of others, or in any way
                                is illegal, threatening, fraudulent, or harmful, or in
                                connection with any unlawful, illegal, fraudulent, or harmful
                                purpose or activity.
                            </li>
                            <li>
                                {" "}
                                (f) To engage in any other conduct that restricts or inhibits
                                anyone&rsquo;s use or enjoyment of Service, or which, as
                                determined by us, may harm or offend Company or users of Service
                                or expose them to liability. Additionally, you agree not to:
                            </li>
                            <ul>
                                <li>
                                    (a) Use Service in any manner that could disable, overburden,
                                    damage, or impair Service or interfere with any other
                                    party&rsquo;s use of Service, including their ability to
                                    engage in real time activities through Service.
                                </li>
                                <li>
                                    (b) Use any robot, spider, or other automatic device, process,
                                    or means to access Service for any purpose, including
                                    monitoring or copying any of the material on Service.{" "}
                                </li>
                                <li>
                                    (c) Use any manual process to monitor or copy any of the
                                    material on Service or for any other unauthorized purpose
                                    without our prior written consent.{" "}
                                </li>
                                <li>
                                    (d) Use any device, software, or routine that interferes with
                                    the proper working of Service.{" "}
                                </li>
                                <li>
                                    (e) Introduce any viruses, trojan horses, worms, logic bombs,
                                    or other material which is malicious or technologically
                                    harmful.{" "}
                                </li>
                                <li>
                                    (f) Attempt to gain unauthorized access to, interfere with,
                                    damage, or disrupt any parts of Service, the server on which
                                    Service is stored, or any server, computer, or database
                                    connected to Service.{" "}
                                </li>
                                <li>
                                    (g) Attack Service via a denial-of-service attack or a
                                    distributed denial-of-service attack.{" "}
                                </li>
                                <li>
                                    (h) Take any action that may damage or falsify Company rating.
                                    (i) Otherwise attempt to interfere with the proper working of
                                    Service.{" "}
                                </li>
                            </ul>
                        </ul>
                    </p>

                    <p>
                        <span className="term_and_condition_point"> 6. Analytics:</span> We
                        may use third-party Service Providers to monitor and analyze the use
                        of our Service. Google Analytics is a web analytics service offered
                        by Google that tracks and reports website traffic. Google uses the
                        data collected to track and monitor the use of our Service. This
                        data is shared with other Google services. Google may use the
                        collected data to contextualize and personalize the ads of its own
                        advertising network. For more information on the privacy practices
                        of Google, please visit the Google Privacy Terms web page:{" "}
                        <a
                            target="__blank"
                            href="https://policies.google.com/privacy?hl=en"
                        >
                            https://policies.google.com/privacy?hl=en
                        </a>
                        We also encourage you to review the Google&rsquo;ss policy for
                        safeguarding your data:{" "}
                        <a href="https://support.google.com/analytics/answer/6004245">
                            https://support.google.com/analytics/answer/6004245
                        </a>
                        .
                    </p>
                    <p>
                        <span className="term_and_condition_point">
                            7. No Use By Minors:
                        </span>{" "}
                        Service is intended only for access and use by individuals at least
                        eighteen (18) years old. By accessing or using any of Company, you
                        warrant and represent that you are at least eighteen (18) years of
                        age and with the full authority, right, and capacity to enter into
                        this agreement and abide by all of the terms and conditions of
                        Terms. If you are not at least eighteen (18) years old, you are
                        prohibited from both the access and usage of Service.
                    </p>
                    <p>
                        <span className="term_and_condition_point">8. Accounts:</span>
                        When you create an account with us, you guarantee that you are above
                        the age of 18, and that the information you provide us is accurate,
                        complete, and current at all times. Inaccurate, incomplete, or
                        obsolete information may result in the immediate termination of your
                        account on Service. You are responsible for maintaining the
                        confidentiality of your account and password, including but not
                        limited to the restriction of access to your computer and/or
                        account. You agree to accept responsibility for any and all
                        activities or actions that occur under your account and/or password,
                        whether your password is with our Service or a third-party service.
                        You must notify us immediately upon becoming aware of any breach of
                        security or unauthorized use of your account. You may not use as a
                        username the name of another person or entity or that is not
                        lawfully available for use, a name or trademark that is subject to
                        any rights of another person or entity other than you, without
                        appropriate authorization. You may not use as a username any name
                        that is offensive, vulgar or obscene. We reserve the right to refuse
                        service, terminate accounts, remove or edit content, or cancel
                        orders in our sole discretion.
                    </p>

                    <p>
                        <span className="term_and_condition_point">
                            9. Intellectual Property:
                        </span>
                        Service and its original content (excluding Content provided by
                        users), features and functionality are and will remain the exclusive
                        property of&#160; Blinksky Nigeria Limited&#160;and its licensors.
                        Service is protected by copyright, trademark, and other laws
                        of&#160;the United States and foreign countries. Our trademarks and
                        trade dress may not be used in connection with any product or
                        service without the prior written consent of&#160;Blinksky Nigeria
                        Limited.
                    </p>
                    <p>
                        <span className="term_and_condition_point">
                            10. Error Reporting and Feedback:
                        </span>
                        You may provide us&#160;directly at hello@digiftng.com&#160;with
                        information and feedback concerning errors, suggestions for
                        improvements, ideas, problems, complaints, and other matters related
                        to our Service (&ldquo;Feedback&rdquo;). You acknowledge and agree
                        that:
                        <ul>
                            <li>
                                (i) you shall not retain, acquire or assert any intellectual
                                property right or other right, title or interest in or to the
                                Feedback;
                            </li>
                            <li>
                                (ii) Company may have development ideas similar to the Feedback;
                            </li>
                            <li>
                                (iii) Feedback does not contain confidential information or
                                proprietary information from you or any third party; and (iv)
                                Company is not under any obligation of confidentiality with
                                respect to the Feedback. In the event the transfer of the
                                ownership to the Feedback is not possible due to applicable
                                mandatory laws, you grant Company and its affiliates an
                                exclusive, transferable, irrevocable, free-of-charge,
                                sub-licensable, unlimited and perpetual right to use (including
                                copy, modify, create derivative works, publish, distribute and
                                commercialize) Feedback in any manner and for any purpose.
                            </li>
                        </ul>
                    </p>
                    <p>
                        <span className="term_and_condition_point">
                            11. Links To Other Web Sites:
                        </span>
                        Our Service may contain links to third party web sites or services
                        that are not owned or controlled by&#160;Blinksky Nigeria Limited.
                        Blinksky Nigeria Limited&#160;has no control over, and assumes no
                        responsibility for the content, privacy policies, or practices of
                        any third-party web sites or services. We do not warrant the
                        offerings of any of these entities/individuals or their websites.
                        YOU ACKNOWLEDGE AND AGREE THAT&#160;Blinksky Nigeria
                        Limited&#160;SHALL NOT BE RESPONSIBLE OR LIABLE, DIRECTLY OR
                        INDIRECTLY, FOR ANY DAMAGE OR LOSS CAUSED OR ALLEGED TO BE CAUSED BY
                        OR IN CONNECTION WITH USE OF OR RELIANCE ON ANY SUCH CONTENT, GOODS
                        OR SERVICES AVAILABLE ON OR THROUGH ANY SUCH THIRD-PARTY WEB SITES
                        OR SERVICES. WE STRONGLY ADVISE YOU TO READ THE TERMS OF SERVICE AND
                        PRIVACY POLICIES OF ANY THIRD-PARTY WEB SITES OR SERVICES THAT YOU
                        VISIT.
                    </p>
                    <p>
                        <span className="term_and_condition_point">
                            12. Disclaimer Of Warranty:
                        </span>
                        THESE SERVICES ARE PROVIDED BY COMPANY ON AN &ldquo;AS IS&rdquo; AND
                        &ldquo;AS AVAILABLE&rdquo; BASIS. COMPANY MAKES NO REPRESENTATIONS
                        OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION
                        OF THEIR SERVICES, OR THE INFORMATION, CONTENT OR MATERIALS INCLUDED
                        THEREIN. YOU EXPRESSLY AGREE THAT YOUR USE OF THESE SERVICES, THEIR
                        CONTENT, AND ANY SERVICES OR ITEMS OBTAINED FROM US IS AT YOUR SOLE
                        RISK.
                    </p>

                    <p>
                        NEITHER COMPANY NOR ANY PERSON ASSOCIATED WITH COMPANY MAKES ANY
                        WARRANTY OR REPRESENTATION WITH RESPECT TO THE COMPLETENESS,
                        SECURITY, RELIABILITY, QUALITY, ACCURACY, OR AVAILABILITY OF THE
                        SERVICES. WITHOUT LIMITING THE FOREGOING, NEITHER COMPANY NOR ANYONE
                        ASSOCIATED WITH COMPANY REPRESENTS OR WARRANTS THAT THE SERVICES,
                        THEIR CONTENT, OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE
                        SERVICES WILL BE ACCURATE, RELIABLE, ERROR-FREE, OR UNINTERRUPTED,
                        THAT DEFECTS WILL BE CORRECTED, THAT THE SERVICES OR THE SERVER THAT
                        MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS
                        OR THAT THE SERVICES OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE
                        SERVICES WILL OTHERWISE MEET YOUR NEEDS OR EXPECTATIONS.
                    </p>

                    <p>
                        COMPANY HEREBY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS
                        OR IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO
                        ANY WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT, AND FITNESS FOR
                        PARTICULAR PURPOSE.
                    </p>

                    <p>
                        THE FOREGOING DOES NOT AFFECT ANY WARRANTIES WHICH CANNOT BE
                        EXCLUDED OR LIMITED UNDER APPLICABLE LAW.
                    </p>

                    <p>
                        <span className="term_and_condition_point">
                            13. Limitation Of Liability:
                        </span>{" "}
                        EXCEPT AS PROHIBITED BY LAW, YOU WILL HOLD US AND OUR OFFICERS,
                        DIRECTORS, EMPLOYEES, AND AGENTS HARMLESS FOR ANY INDIRECT,
                        PUNITIVE, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGE, HOWEVER IT
                        ARISES (INCLUDING ATTORNEYS&#160; FEES AND ALL RELATED COSTS AND
                        EXPENSES OF LITIGATION AND ARBITRATION, OR AT TRIAL OR ON APPEAL, IF
                        ANY, WHETHER OR NOT LITIGATION OR ARBITRATION IS INSTITUTED),
                        WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE, OR OTHER TORTIOUS
                        ACTION, OR ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT,
                        INCLUDING WITHOUT LIMITATION ANY CLAIM FOR PERSONAL INJURY OR
                        PROPERTY DAMAGE, ARISING FROM THIS AGREEMENT AND ANY VIOLATION BY
                        YOU OF ANY FEDERAL, STATE, OR LOCAL LAWS, STATUTES, RULES, OR
                        REGULATIONS, EVEN IF COMPANY HAS BEEN PREVIOUSLY ADVISED OF THE
                        POSSIBILITY OF SUCH DAMAGE. EXCEPT AS PROHIBITED BY LAW, IF THERE IS
                        LIABILITY FOUND ON THE PART OF COMPANY, IT WILL BE LIMITED TO THE
                        AMOUNT PAID FOR THE PRODUCTS AND/OR SERVICES, AND UNDER NO
                        CIRCUMSTANCES WILL THERE BE CONSEQUENTIAL OR PUNITIVE DAMAGES. SOME
                        STATES DO NOT ALLOW THE EXCLUSION OR LIMITATION OF PUNITIVE,
                        INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE PRIOR LIMITATION OR
                        EXCLUSION MAY NOT APPLY TO YOU.
                    </p>

                    <p>
                        <span className="term_and_condition_point">14. Termination:</span>{" "}
                        We may terminate or suspend your account and bar access to Service
                        immediately, without prior notice or liability, under our sole
                        discretion, for any reason whatsoever and without limitation,
                        including but not limited to a breach of Terms.
                    </p>

                    <p>
                        If you wish to terminate your account, you may simply discontinue
                        using Service. All provisions of Terms which by their nature should
                        survive termination shall survive termination, including, without
                        limitation, ownership provisions, warranty disclaimers, indemnity
                        and limitations of liability.
                    </p>

                    <p>
                        <span className="term_and_condition_point">15. Governing Law:</span>
                        These Terms shall be governed and construed in accordance with the
                        laws of&#160;Federal Republic of Nigeria&#160;without regard to its
                        conflict of law provisions.
                    </p>

                    <p>
                        Our failure to enforce any right or provision of these Terms will
                        not be considered a waiver of those rights. If any provision of
                        these Terms is held to be invalid or unenforceable by a court, the
                        remaining provisions of these Terms will remain in effect. These
                        Terms constitute the entire agreement between us regarding our
                        Service and supersede and replace any prior agreements we might have
                        had between us regarding Service.
                    </p>

                    <p>
                        <span className="term_and_condition_point">
                            16. Changes To Service:
                        </span>{" "}
                        We reserve the right to withdraw or amend our Service, and any
                        service or material we provide via Service, in our sole discretion
                        without notice. We will not be liable if for any reason all or any
                        part of Service is unavailable at any time or for any period. From
                        time to time, we may restrict access to some parts of Service, or
                        the entire Service, to users, including registered users.
                    </p>

                    <p>
                        <span className="term_and_condition_point">
                            17. Amendments To Terms:
                        </span>{" "}
                        We may amend Terms at any time by posting the amended terms on this
                        site. It is your responsibility to review these Terms periodically.
                    </p>

                    <p>
                        Your continued use of the Platform following the posting of revised
                        Terms means that you accept and agree to the changes. You are
                        expected to check this page frequently so you are aware of any
                        changes, as they are binding on you.
                    </p>

                    <p>
                        By continuing to access or use our Service after any revisions
                        become effective, you agree to be bound by the revised terms. If you
                        do not agree to the new terms, you are no longer authorized to use
                        Service.
                    </p>

                    <p>
                        <span className="term_and_condition_point">
                            18. Waiver And Severability:
                        </span>{" "}
                        No waiver by Company of any term or condition set forth in Terms
                        shall be deemed a further or continuing waiver of such term or
                        condition or a waiver of any other term or condition, and any
                        failure of Company to assert a right or provision under Terms shall
                        not constitute a waiver of such right or provision.
                    </p>

                    <p>
                        If any provision of Terms is held by a court or other tribunal of
                        competent jurisdiction to be invalid, illegal or unenforceable for
                        any reason, such provision shall be eliminated or limited to the
                        minimum extent such that the remaining provisions of Terms will
                        continue in full force and effect.
                    </p>

                    <p>
                        <span className="term_and_condition_point">
                            19. Acknowledgement:
                        </span>{" "}
                        BY USING SERVICE OR OTHER SERVICES PROVIDED BY US, YOU ACKNOWLEDGE
                        THAT YOU HAVE READ THESE TERMS OF SERVICE AND AGREE TO BE BOUND BY
                        THEM.
                    </p>

                    <p>
                        <span className="term_and_condition_point">20. Contact Us:</span>{" "}
                        Please send your feedback, comments, requests for technical support.
                    </p>

                    <p>By email: hello@digiftng.com.</p>
                </div>
            </Layout>
        </div>
    );
};

const mapDispatchToProps = {
    getGiftCards: handleFetchGiftCards,
    selectGiftCard: stageGiftCard,
};

const Index = connect(null, mapDispatchToProps)(IndexPage);
export default withAuth(Index, false);
