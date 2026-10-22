import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BACKEND_URL } from '../constants';
import playerBg from '../assets/playerCard.jpeg'
import ReactDOM from 'react-dom/client'; // Import createRoot from React 18
import { format } from 'path';
import soldImg from '../assets/sold.png'
import { Button } from '@/components/ui/button';
import { Download } from "lucide-react";




interface props{
    playerList:any
    teamName :any
}

const PDFCreator: React.FC<props> = ({playerList,teamName}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null); // To capture the player card
  const [isLoading, setIsLoading] = useState(false)


  const capitalizeFirst = (str: any) => {
    if (!str) return "";
    str = str.toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const generatePDF = async () => {
    setIsLoading(true);
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 2; // Margin for all sides
    const contentWidth = pageWidth - margin * 3;
    const contentHeight = pageHeight - margin * 60;
    let pageNumber = 1;

    for (const player of playerList) {
        // Fetch the profile image and convert it to base64 if needed
        const profileImageUrl = `https://storage.googleapis.com/rajas_pl/${player.profile_image}`;
        // <img key={index} src={BACKEND_URL + '/player_images/' + player.profile_image} alt="logo" style={profileImageStyle}/> */}
        const profileImageBase64 = await fetch(profileImageUrl)
            .then((res) => res.blob())
            .then((blob) => new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            }));

        // Create a temporary div to render each player's content
        const tempDiv = document.createElement("div");
        tempDiv.style.width = `${contentWidth * 3}px`; // Increase width for higher-res canvas
        tempDiv.style.height = `${contentHeight * 5}px`; // Increase height for higher-res canvas
        tempDiv.style.marginTop = '20px';
        tempDiv.style.display = 'flex';
        tempDiv.style.justifyContent = 'center';
        tempDiv.style.alignItems = 'center';
        tempDiv.style.backgroundColor = 'white';
        tempDiv.style.overflow = "hidden";

        // Set card styles and content
        tempDiv.innerHTML = `
            <div style="
                border: 1px solid #ccc; 
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
                border-radius: 8px;
                width: 100%; 
                height: 100%;
                background-image: url(${playerBg});
                background-size: cover;
                background-position: center;
                
                ">



                <div style="display:flex">
                    <img src="${profileImageBase64}" alt="Player Image" style="height: 18.1rem; width: 12.8rem; margin-left: 32px; object-fit: cover; margin-top: 328px; border-radius:10px;
                    mask-composite: intersect;" />
                </div>

                <div style="text-align:left;">
                    <p style="margin-top:-600px; margin-left:40px; font-size: 40px; color: black; font-weight:bold;">${player.id}</p>
                </div>


                <div style="text-align:left">
                    <p style="margin-top:585px; font-size: 21px; color:black; font-weight:bold;padding-left:310px;">${player.player_role}</p>
                </div>

                
               <div style="text-align:left">
                    <p style="margin-top:1px; font-size: 21px; color:black; font-weight:bold;padding-left:310px;">${player.batting_style}</p>
                </div>

                
                <div style="text-align:left">
                    <p style="margin-top:-10px; font-size: 21px; color:black; font-weight:bold;padding-left:310px;">${player.bowling_style}</p>
                </div>

                
                <div style="text-align:left">
                    <p style="margin-top:-7px; font-size: 21px; color:black; font-weight:bold;padding-left:310px;">${capitalizeFirst(player.location)}</p>
                </div>

                <div style="text-align:left">
                    <p style="margin-top:-7px; font-size: 21px; color:black; font-weight:bold;margin-left:310px;">${player.contact_no}</p>
                </div>

                 <div style="text-align:left">
                    <p style="margin-top:2px; margin-left:40px; font-size: 21px; color:white; font-weight:bold;">${player.fullname.toUpperCase()}</p>
                </div>

                ${player.bid_amount ? `
                <div style="text-align:left";>
                    <img
                        src="${soldImg}"
                        alt="${player.fullname}"
                        style="width:120px; height:120px; object-fit:cover;margin-left:480px;margin-top:-150px;"
                    />

                    <p style="margin-top:-60px; margin-left:523px; font-size:12px; color:black; font-weight:bold;">
                        ${player.bid_amount}
                    </p>
                </div>
                ` : ""}

                
            </div>
        `;
        

        document.body.appendChild(tempDiv);

        // Capture the temporary content as an image
        const canvas = await html2canvas(tempDiv, { scale: 1.2, useCORS: true,allowTaint: false, }); // Scale for better quality
        const imgData = canvas.toDataURL('image/jpeg', 0.7);
        const imgWidth = contentWidth; // Width to fit within margins
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Preserve aspect ratio

        // Add the captured image to the PDF within margins
        if (pageNumber > 1) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);

        // Optional: Add footer with page number
        pdf.setFontSize(10);
        pdf.setTextColor(150);
        // pdf.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        pageNumber++;

        // Remove the temporary div
        document.body.removeChild(tempDiv);
    }

    // Save the PDF
    pdf.save(teamName ? teamName+'.pdf' : "ASIAN PREMIER LEAGUE SEASON 2 Players.pdf");
    setIsLoading(false)
};

 
  return (
    <div>
      {/* <button onClick={generatePDF}>Generate PDF</button> */}

       {isLoading && (

       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
  <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center">

    {/* Spinner */}
    <div className="relative">
      <div className="w-16 h-16 border-4 border-yellow-400/30 rounded-full"></div>
      <div className="absolute inset-0 w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    {/* Message */}
    <h3 className="mt-5 text-lg sm:text-xl font-bold text-gray-800">
      Downloading File
    </h3>

    <p className="mt-2 text-sm sm:text-base text-gray-600">
      Please stay on this page while your file is being prepared.
    </p>

    {/* Animated Dots */}
    <div className="flex gap-2 mt-5">
      <span className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></span>
      <span
        className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"
        style={{ animationDelay: "0.15s" }}
      ></span>
      <span
        className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"
        style={{ animationDelay: "0.3s" }}
      ></span>
    </div>

  </div>
</div>

)}

      <Button
  onClick={generatePDF}
  className="w-full sm:w-auto h-10 sm:h-12 px-4 sm:px-6 bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-gold flex items-center justify-center"
>
  <Download className="h-5 w-5" />
</Button>


    </div>
  );



};

const playerListContainer: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(23rem, 1fr))',
    gap: '2rem',
    // maxWidth: '120rem',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor:'white'
}

const cardIconTextStyle: React.CSSProperties = {
    padding: '10px',
    cursor: 'pointer',
    color: 'yellow',
    textAlign: 'left',
    fontSize: '50px',
    textShadow: "1px 1px 0 #f00, 2px 2px 0 #f00, 3px 3px 0 #f00",
    fontWeight:"bolder",
    fontStyle:'italic'
  };

const cardSubHeader : React.CSSProperties = {
    fontSize: '25px',
    fontFamily: 'auto',
    marginTop: '11px',
    // textAlign: 'center',
    border: "2px solid #ccc",
    borderRadius: "8px",
    // width: "130px",
    backgroundColor: "antiquewhite",
    color : "black",
    padding:"3px",
    marginLeft:"125px",
    height:"fit-content"
}


const cardHeaderTextStyle: React.CSSProperties = {
    gap: '2rem',
    cursor: 'pointer',
    // color: 'yellow',
    textAlign: 'center',
    fontSize: '23px',
    // textShadow: '1px 1px 0 #999, 2px 2px 0 #999, 3px 3px 0 #999',
    fontFamily: "Arial,Helvetica, sans-serif",
    justifyContent:'center'
    
  };

  const cardBodyTextStyle: React.CSSProperties = {
    color: 'black',
    textAlign: 'left',
    fontSize: '25px',
    paddingLeft:"10px"
  };

const n05IconStyle : React.CSSProperties = {
    display:'flex', justifyContent:'end', marginLeft:"95px"
}

const imageStyle1 : React.CSSProperties = {
    height : '7rem',
    width: '7rem',
    padding:'5px',
    // borderRadius: '13px',
    // objectFit: 'cover',
    // border: 'none'
    // marginLeft:"-15px",
    // marginTop:"-122px"
}

const spanText :  React.CSSProperties = {
    marginTop: '-126px', 
    fontWeight: 'bold', 
    fontSize: '16px',
    paddingLeft : '87px',
    color:'white'
    // paddingTop : '8px'
}

const spanText1 :  React.CSSProperties = {
    marginTop: '4px', 
    fontWeight: 'bold', 
    fontSize: '16px',
    paddingLeft : '88px',
    color : 'white'
    // paddingTop : '8px'
}

const fullNameText :  React.CSSProperties = {
    marginTop: '-149px', 
    fontWeight: 'bold', 
    fontSize: '14px',
    paddingLeft : '85px',
    color:"white"
}

const idText :  React.CSSProperties = {
    marginTop: '-193px', 
    fontWeight: 'bold', 
    fontSize: '21px',
    paddingLeft : '26px',
    color:"white"
}

const svgStyle :React.CSSProperties = {
    height : '1rem',
    width: '1rem',
    objectFit:'cover',
    padding:'10px',
    filter: 'invert(85%) sepia(20%) saturate(150%) hue-rotate(200deg) brightness(120%) contrast(120%)'

}

const profileImageStyle : React.CSSProperties = {
    height: '11.5rem',
    width: '6.5rem',
    // padding: '5px',
    alignItems: 'flex-start',
    // display: 'grid',
    marginLeft: '216px',
    objectFit:'cover',
    // borderRadius : "50%"
    marginTop:"289px",
    borderImage: "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%)",
//   WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,2) 10%)",
//   maskImage: "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%)"
  
}

const players__card__wrap :  React.CSSProperties = {
    gap: '2rem',
    // backgroundImage: 'linear-gradient(to top,  #DE3163	, #000080	)',
    // backgroundImage :"linear-gradient(#194564,#4c8dba, #194564)",
    backgroundImage : `url(${playerBg})`,
    border: '1px solid #ccc', 
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
    borderRadius: '8px', 
    margin: '0 auto',
    marginTop:'25px',
    // backgroundColor:"#d4af37"
    width:"351px",
    height:"497px",
    // overflow: 'hidden'
  }

const no5Style : React.CSSProperties = {
    height : "3rem",
    width : "4rem",
    // borderRadius : "50%",
    padding:"5px",
    marginLeft:"15px",
    marginTop:"-35px"

}

const cardHeader :  React.CSSProperties = {
    display: 'flex',
    justifyContent:'flex-start'
}

const cardFooter :  React.CSSProperties = {
    display: 'flex',
    backgroundColor : 'purple',
    marginBottom:'10px'
}

const playerCountStyle : React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor:'#d4af37'
}

const inputContainerStyle: React.CSSProperties = {
    flexBasis: "48%",
    height: "2rem",
    border: "2px solid #ccc",
    borderRadius: "8px",
    margin:'5px',
    // width : '80%'
  };

const cardTitleStyle : React.CSSProperties = {
    fontSize: '30px',
    fontFamily: 'auto',
    marginTop:'8px',
    textAlign: 'center',
    background: "linear-gradient(to top, #f32170, #ff6b08,#cf23cf, #eedd44)",
    WebkitTextFillColor: "transparent",
    WebkitBackgroundClip: "text",
    marginLeft:"10px"
    
}

const isMobile = window.matchMedia("(max-width: 600px)").matches;
    if (isMobile) {
        playerCountStyle.fontSize = '12px'; // Adjust font size for mobile view
        playerCountStyle.padding = '10px'

        playerListContainer.gridTemplateColumns =  'repeat(auto-fit, minmax(18rem, 1fr))'
        playerListContainer.padding =  '0rem'

        players__card__wrap.margin = '10px'

        cardIconTextStyle.fontSize = "35px"
        cardIconTextStyle.marginTop = "15px";

        cardSubHeader.fontSize = '20px';
        cardTitleStyle.fontSize = '26px';

        spanText.paddingLeft = '5px';
        n05IconStyle.marginLeft = '80px'
        no5Style.marginTop = '5px'

    }


export default PDFCreator;
