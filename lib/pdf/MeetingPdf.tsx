// import React from "react";
// import {
//   Page,
//   Text,
//   View,
//   Document,
//   StyleSheet,
//   Font,
//   Image as PDFImage,
// } from "@react-pdf/renderer";
// import ReactHtmlParser from "react-html-parser";

// // Register fonts
// Font.register({
//   family: "Open Sans",
//   fonts: [
//     {
//       src: "https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0e.ttf",
//       fontWeight: 400,
//     },
//     {
//       src: "https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN7rgOUuhs.ttf",
//       fontWeight: 600,
//     },
//     {
//       src: "https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UNirkOUuhs.ttf",
//       fontWeight: 700,
//     },
//   ],
// });

// interface ParsedElementProps {
//   children: React.ReactNode;
//   [key: string]: any; // Allow any other props
// }

// // Create styles
// const styles = StyleSheet.create({
//   page: {
//     padding: 40,
//     fontFamily: "Open Sans",
//     fontSize: 11,
//     lineHeight: 1.5,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 30,
//     paddingBottom: 20,
//     borderBottomWidth: 2,
//     borderBottomColor: "#1a365d",
//     borderBottomStyle: "solid",
//   },
//   headerLeft: {
//     flex: 3,
//   },
//   headerRight: {
//     flex: 1,
//     alignItems: "flex-end",
//   },
//   logo: {
//     width: 120,
//     height: 40,
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 700,
//     color: "#1a365d",
//     marginBottom: 5,
//     lineHeight: 1.2,
//   },
//   subtitle: {
//     fontSize: 12,
//     color: "#4a5568",
//     marginBottom: 3,
//     lineHeight: 1.3,
//   },
//   label: {
//     fontSize: 10,
//     fontWeight: 600,
//     color: "#718096",
//     marginBottom: 2,
//     textTransform: "uppercase",
//   },
//   value: {
//     fontSize: 11,
//     fontWeight: 400,
//     color: "#2d3748",
//   },
//   section: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 14,
//     fontWeight: 700,
//     color: "#1a365d",
//     marginBottom: 10,
//     paddingBottom: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: "#e2e8f0",
//     borderBottomStyle: "solid",
//   },
//   grid: {
//     flexDirection: "row",
//     marginBottom: 10,
//   },
//   gridCol: {
//     flex: 1,
//   },
//   table: {
//     width: "100%",
//     marginBottom: 15,
//   },
//   tableHeader: {
//     flexDirection: "row",
//     backgroundColor: "#f7fafc",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e2e8f0",
//     paddingVertical: 5,
//   },
//   tableRow: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e2e8f0",
//     paddingVertical: 8,
//   },
//   tableCol: {
//     paddingHorizontal: 5,
//   },
//   tableColName: {
//     width: "35%",
//   },
//   tableColStatus: {
//     width: "25%",
//   },
//   tableColRole: {
//     width: "20%",
//   },
//   tableColActions: {
//     width: "20%",
//   },
//   badge: {
//     borderRadius: 4,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     fontSize: 9,
//     fontWeight: 600,
//   },
//   badgeScheduled: {
//     backgroundColor: "#bee3f8",
//     color: "#2b6cb0",
//   },
//   badgeInProgress: {
//     backgroundColor: "#bee3f8",
//     color: "#2b6cb0",
//   },
//   badgeCompleted: {
//     backgroundColor: "#c6f6d5",
//     color: "#276749",
//   },
//   badgeCancelled: {
//     backgroundColor: "#fed7d7",
//     color: "#9b2c2c",
//   },
//   badgePending: {
//     backgroundColor: "#feebc8",
//     color: "#975a16",
//   },
//   badgeAccepted: {
//     backgroundColor: "#c6f6d5",
//     color: "#276749",
//   },
//   badgeDeclined: {
//     backgroundColor: "#fed7d7",
//     color: "#9b2c2c",
//   },
//   badgeTentative: {
//     backgroundColor: "#feebc8",
//     color: "#975a16",
//   },
//   noteContainer: {
//     marginBottom: 15,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     borderRadius: 4,
//   },
//   noteTitle: {
//     fontSize: 12,
//     fontWeight: 600,
//     color: "#2d3748",
//     marginBottom: 5,
//   },
//   noteMeta: {
//     fontSize: 9,
//     color: "#718096",
//     marginBottom: 5,
//   },
//   noteContent: {
//     fontSize: 10,
//     color: "#4a5568",
//   },
//   momSection: {
//     marginBottom: 15,
//   },
//   momTitle: {
//     fontSize: 12,
//     fontWeight: 600,
//     color: "#2d3748",
//     marginBottom: 5,
//   },
//   momContent: {
//     fontSize: 10,
//     color: "#4a5568",
//     marginBottom: 10,
//   },
//   footer: {
//     position: "absolute",
//     bottom: 30,
//     left: 40,
//     right: 40,
//     fontSize: 9,
//     color: "#718096",
//     textAlign: "center",
//     borderTopWidth: 1,
//     borderTopColor: "#e2e8f0",
//     paddingTop: 10,
//   },
//   pageNumber: {
//     position: "absolute",
//     bottom: 20,
//     left: 0,
//     right: 0,
//     textAlign: "center",
//     fontSize: 9,
//     color: "#718096",
//   },
// });

// interface MeetingPDFProps {
//   meeting: {
//     id: string;
//     title: string;
//     description?: string;
//     agenda?: string;
//     startDateTime: string;
//     endDateTime: string;
//     venue?: string;
//     status: "Scheduled" | "InProgress" | "Completed" | "Cancelled" | "Pending";
//     priority: "Low" | "Medium" | "High" | "Urgent";
//     organizer: {
//       userId: string;
//       fullName: string;
//       userImage?: string;
//       designation?: string;
//     };
//     participants: Array<{
//       userId: string;
//       responseStatus: "Pending" | "Accepted" | "Declined" | "Tentative";
//       role: "Organizer" | "CoOrganizer" | "Attendee" | "Optional";
//       user: {
//         userId: string;
//         fullName: string;
//         userImage?: string;
//         designation?: string;
//       };
//     }>;
//     notes: Array<{
//       id: string;
//       title?: string;
//       content: string;
//       noteType: string;
//       createdAt: string;
//       author: {
//         userId: string;
//         fullName: string;
//         userImage?: string;
//       };
//     }>;
//     approvals: Array<{
//       userId: string;
//       isApproved: boolean;
//       approvedAt?: string;
//       comments?: string;
//       user: {
//         userId: string;
//         fullName: string;
//         userImage?: string;
//       };
//     }>;
//     meetingMinutes: boolean;
//     businessFromLastMeeting: string;
//     openIssues: string;
//     newBusiness: string;
//     updatesAndAnnouncements: string;
//     adjourment: string;
//   };
//   company?: {
//     name: string;
//     logo?: string;
//     address?: string;
//     website?: string;
//   };
//   userRole?: string; // Role of the user generating the PDF
// }

// export const MeetingPDF = ({ meeting, company, userRole }: MeetingPDFProps) => {
//   // Format date and time
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const formatTime = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // Get badge style based on status
//   const getBadgeStyle = (status: string) => {
//     switch (status) {
//       case "Completed":
//         return [styles.badge, styles.badgeCompleted];
//       case "Cancelled":
//         return [styles.badge, styles.badgeCancelled];
//       case "InProgress":
//         return [styles.badge, styles.badgeInProgress];
//       case "Pending":
//         return [styles.badge, styles.badgePending];
//       default:
//         return [styles.badge, styles.badgeScheduled];
//     }
//   };

//   // Get response badge style
//   const getResponseBadgeStyle = (response: string) => {
//     switch (response) {
//       case "Accepted":
//         return [styles.badge, styles.badgeAccepted];
//       case "Declined":
//         return [styles.badge, styles.badgeDeclined];
//       case "Tentative":
//         return [styles.badge, styles.badgeTentative];
//       default:
//         return [styles.badge, styles.badgePending];
//     }
//   };

//   const htmlParser = (htmlContent: string) => {
//     const parsedElements = ReactHtmlParser(htmlContent);

//     const parseElements = (elements: React.ReactNode): React.ReactNode[] => {
//       const result: React.ReactNode[] = [];

//       React.Children.forEach(elements, (element, index) => {
//         if (typeof element === "string") {
//           result.push(<Text key={index}>{element}</Text>);
//         } else if (React.isValidElement(element)) {
//           const elementProps = element.props as ParsedElementProps;
//           const type = element.type;
//           const children = elementProps.children
//             ? parseElements(elementProps.children)
//             : null;

//           switch (type) {
//             case "p":
//               result.push(
//                 <Text key={index} style={{ marginBottom: 5 }}>
//                   {children}
//                 </Text>
//               );
//               break;
//             case "strong":
//             case "b":
//               result.push(
//                 <Text
//                   key={index}
//                   style={{ fontFamily: "Open Sans", fontWeight: 700 }}
//                 >
//                   {children}
//                 </Text>
//               );
//               break;
//             case "em":
//             case "i":
//               result.push(
//                 <Text key={index} style={{ fontStyle: "italic" }}>
//                   {children}
//                 </Text>
//               );
//               break;
//             case "u":
//               result.push(
//                 <Text key={index} style={{ textDecoration: "underline" }}>
//                   {children}
//                 </Text>
//               );
//               break;
//             case "h1":
//               result.push(
//                 <Text
//                   key={index}
//                   style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}
//                 >
//                   {children}
//                 </Text>
//               );
//               break;
//             case "h2":
//               result.push(
//                 <Text
//                   key={index}
//                   style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}
//                 >
//                   {children}
//                 </Text>
//               );
//               break;
//             case "h3":
//               result.push(
//                 <Text
//                   key={index}
//                   style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}
//                 >
//                   {children}
//                 </Text>
//               );
//               break;
//             case "h4":
//             case "h5":
//             case "h6":
//               result.push(
//                 <Text
//                   key={index}
//                   style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}
//                 >
//                   {children}
//                 </Text>
//               );
//               break;
//             case "ul":
//               result.push(
//                 <View key={index} style={{ marginLeft: 10, marginBottom: 5 }}>
//                   {children}
//                 </View>
//               );
//               break;
//             case "ol":
//               result.push(
//                 <View key={index} style={{ marginLeft: 10, marginBottom: 5 }}>
//                   {children}
//                 </View>
//               );
//               break;
//             case "li":
//               result.push(
//                 <View
//                   key={index}
//                   style={{ flexDirection: "row", marginBottom: 2 }}
//                 >
//                   <Text>• </Text>
//                   <Text>{children}</Text>
//                 </View>
//               );
//               break;
//             case "br":
//               result.push(<Text key={index}>{"\n"}</Text>);
//               break;
//             case "a":
//               result.push(
//                 <Text
//                   key={index}
//                   style={{ color: "#3182ce", textDecoration: "underline" }}
//                 >
//                   {children || elementProps.href}
//                 </Text>
//               );
//               break;
//             case "span":
//               result.push(<Text key={index}>{children}</Text>);
//               break;
//             case "div":
//               result.push(
//                 <View key={index} style={{ marginBottom: 5 }}>
//                   {children}
//                 </View>
//               );
//               break;
//             case "blockquote":
//               result.push(
//                 <View
//                   key={index}
//                   style={{
//                     borderLeft: "2px solid #e2e8f0",
//                     paddingLeft: 10,
//                     marginBottom: 10,
//                   }}
//                 >
//                   {children}
//                 </View>
//               );
//               break;
//             case "pre":
//               result.push(
//                 <View
//                   key={index}
//                   style={{
//                     backgroundColor: "#f7fafc",
//                     padding: 8,
//                     borderRadius: 4,
//                     marginBottom: 10,
//                     fontFamily: "Courier",
//                     fontSize: 10,
//                   }}
//                 >
//                   <Text>{children}</Text>
//                 </View>
//               );
//               break;
//             case "code":
//               result.push(
//                 <Text
//                   key={index}
//                   style={{
//                     backgroundColor: "#f7fafc",
//                     paddingHorizontal: 4,
//                     borderRadius: 2,
//                     fontFamily: "Courier",
//                     fontSize: 10,
//                   }}
//                 >
//                   {children}
//                 </Text>
//               );
//               break;
//             case "hr":
//               result.push(
//                 <View
//                   key={index}
//                   style={{
//                     borderBottomWidth: 1,
//                     borderBottomColor: "#e2e8f0",
//                     marginVertical: 10,
//                   }}
//                 />
//               );
//               break;
//             default:
//               result.push(<Text key={index}>{children}</Text>);
//           }
//         }
//       });

//       return result;
//     };

//     return <View>{parseElements(parsedElements)}</View>;
//   };

//   return (
//     <Document>
//       <Page size='A4' style={styles.page}>
//         {/* Header with company logo and meeting title */}
//         <View style={styles.header}>
//           <View style={styles.headerLeft}>
//             <PDFImage src={"/img/logo_light.png"} style={styles.logo} />
//             <Text style={styles.title}>{meeting.title}</Text>
//           </View>
//           <View style={styles.headerRight}>
//             <Text style={styles.label}>Status</Text>
//             <Text style={getBadgeStyle(meeting.status)}>{meeting.status}</Text>
//             <Text style={styles.label}>Priority</Text>
//             <Text style={styles.value}>{meeting.priority}</Text>
//           </View>
//         </View>

//         {/* Meeting Details */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Meeting Details</Text>
//           <View style={styles.grid}>
//             <View style={styles.gridCol}>
//               <Text style={styles.label}>Date</Text>
//               <Text style={styles.value}>
//                 {formatDate(meeting.startDateTime)}
//               </Text>

//               <Text style={styles.label}>Time</Text>
//               <Text style={styles.value}>
//                 {formatTime(meeting.startDateTime)} -{" "}
//                 {formatTime(meeting.endDateTime)}
//               </Text>
//             </View>
//             <View style={styles.gridCol}>
//               <Text style={styles.label}>Location</Text>
//               <Text style={styles.value}>
//                 {meeting.venue || "Not specified"}
//               </Text>

//               <Text style={styles.label}>Organizer</Text>
//               <Text style={styles.value}>{meeting.organizer.fullName}</Text>
//               {meeting.organizer.designation && (
//                 <Text style={[styles.value, { fontSize: 9 }]}>
//                   {meeting.organizer.designation}
//                 </Text>
//               )}
//             </View>
//           </View>
//         </View>

//         {/* Meeting Description/Agenda */}
//         {meeting.description && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Agenda</Text>
//             <Text style={styles.value}>{htmlParser(meeting.description)}</Text>
//           </View>
//         )}

//         {/* Participants */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>
//             Participants ({meeting.participants.length})
//           </Text>
//           <View style={styles.table}>
//             <View style={styles.tableHeader}>
//               <Text style={[styles.tableCol, styles.tableColName]}>Name</Text>
//               <Text style={[styles.tableCol, styles.tableColRole]}>Role</Text>
//               <Text style={[styles.tableCol, styles.tableColStatus]}>
//                 Status
//               </Text>
//             </View>
//             {meeting.participants.map((participant, index) => (
//               <View key={index} style={styles.tableRow}>
//                 <Text style={[styles.tableCol, styles.tableColName]}>
//                   {participant.user.fullName}
//                   {participant.user.designation && (
//                     <Text style={{ fontSize: 9, color: "#718096" }}>
//                       {"\n"}
//                       {participant.user.designation}
//                     </Text>
//                   )}
//                 </Text>
//                 <Text style={[styles.tableCol, styles.tableColRole]}>
//                   {participant.role}
//                 </Text>
//                 <Text style={[styles.tableCol, styles.tableColStatus]}>
//                   <Text
//                     style={getResponseBadgeStyle(participant.responseStatus)}
//                   >
//                     {participant.responseStatus}
//                   </Text>
//                 </Text>
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Meeting Notes */}
//         {meeting.notes.length > 0 && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Meeting Notes</Text>
//             {meeting.notes.map((note, index) => (
//               <View key={index} style={styles.noteContainer}>
//                 {note.title && (
//                   <Text style={styles.noteTitle}>{note.title}</Text>
//                 )}
//                 <Text style={styles.noteMeta}>
//                   {note.author.fullName} • {note.noteType} •{" "}
//                   {formatDate(note.createdAt)}
//                 </Text>
//                 <Text style={styles.noteContent}>{note.content}</Text>
//               </View>
//             ))}
//           </View>
//         )}

//         {/* Minutes of Meeting */}
//         {meeting.meetingMinutes && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Minutes of Meeting</Text>

//             {/* Business from Last Meeting */}
//             {meeting.businessFromLastMeeting && (
//               <View style={styles.momSection}>
//                 <Text style={styles.momTitle}>Business from Last Meeting</Text>
//                 <Text style={styles.momContent}>
//                   {htmlParser(meeting.businessFromLastMeeting)}
//                 </Text>
//               </View>
//             )}

//             {/* Open Issues */}
//             {meeting.openIssues && (
//               <View style={styles.momSection}>
//                 <Text style={styles.momTitle}>Open Issues</Text>
//                 <Text style={styles.momContent}>
//                   {htmlParser(meeting.openIssues)}
//                 </Text>
//               </View>
//             )}

//             {/* New Business */}
//             {meeting.newBusiness && (
//               <View style={styles.momSection}>
//                 <Text style={styles.momTitle}>New Business</Text>
//                 <Text style={styles.momContent}>
//                   {htmlParser(meeting.newBusiness)}
//                 </Text>
//               </View>
//             )}

//             {/* Updates and Announcements */}
//             {meeting.updatesAndAnnouncements && (
//               <View style={styles.momSection}>
//                 <Text style={styles.momTitle}>Updates and Announcements</Text>
//                 <Text style={styles.momContent}>
//                   {htmlParser(meeting.updatesAndAnnouncements)}
//                 </Text>
//               </View>
//             )}

//             {/* Adjournment */}
//             {meeting.adjourment && (
//               <View style={styles.momSection}>
//                 <Text style={styles.momTitle}>Adjournment</Text>
//                 <Text style={styles.momContent}>
//                   {htmlParser(meeting.adjourment)}
//                 </Text>
//               </View>
//             )}
//           </View>
//         )}

//         {/* Approvals */}
//         {meeting.approvals.length > 0 && (userRole === "Admin" || "CEO") && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Approvals</Text>
//             <View style={styles.table}>
//               <View style={styles.tableHeader}>
//                 <Text style={[styles.tableCol, styles.tableColName]}>
//                   Approver
//                 </Text>
//                 <Text style={[styles.tableCol, styles.tableColStatus]}>
//                   Status
//                 </Text>
//                 <Text style={[styles.tableCol, styles.tableColActions]}>
//                   Date
//                 </Text>
//                 <Text style={styles.tableCol}>Comments</Text>
//               </View>
//               {meeting.approvals.map((approval, index) => (
//                 <View key={index} style={styles.tableRow}>
//                   <Text style={[styles.tableCol, styles.tableColName]}>
//                     {approval.user.fullName}
//                   </Text>
//                   <Text style={[styles.tableCol, styles.tableColStatus]}>
//                     <Text
//                       style={
//                         approval.isApproved
//                           ? [styles.badge, styles.badgeAccepted]
//                           : [styles.badge, styles.badgeDeclined]
//                       }
//                     >
//                       {approval.isApproved ? "Approved" : "Declined"}
//                     </Text>
//                   </Text>
//                   <Text style={[styles.tableCol, styles.tableColActions]}>
//                     {approval.approvedAt
//                       ? formatDate(approval.approvedAt)
//                       : "Pending"}
//                   </Text>
//                   <Text style={styles.tableCol}>
//                     {approval.comments || "No comments"}
//                   </Text>
//                 </View>
//               ))}
//             </View>
//           </View>
//         )}

//         {/* Footer */}
//         <View style={styles.footer}>
//           <Text>
//             Confidential - {company?.name || "The Truth International"}
//           </Text>
//           {company?.website && (
//             <Text>
//               {company.website} • Generated on{" "}
//               {formatDate(new Date().toString())}
//             </Text>
//           )}
//         </View>

//         {/* Page number */}
//         <Text
//           style={styles.pageNumber}
//           render={({ pageNumber, totalPages }) =>
//             `${pageNumber} / ${totalPages}`
//           }
//           fixed
//         />
//       </Page>
//     </Document>
//   );
// };

// // Default company info if not provided
// MeetingPDF.defaultProps = {
//   company: {
//     name: "The Truth International",
//     logo: "/img/logo_light.png",
//     address:
//       "Office # 205 D, 2nd Floor, Evacuee Trust Complex, Aga Khan road, F-5/1, Islamabad, Pakistan.",
//     website: "https://thetruthinternational.com/",
//   },
// };
