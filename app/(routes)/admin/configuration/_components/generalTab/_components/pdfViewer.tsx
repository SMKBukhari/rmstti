import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Set the worker script to the locally hosted file
pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";

interface PDFViewerProps {
  fileUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="flex flex-col items-center">
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        className="max-h-[calc(80vh-100px)] overflow-auto"
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <div className="flex items-center justify-center mt-4">
        <Button
          onClick={() => setPageNumber(pageNumber - 1)}
          disabled={pageNumber <= 1}
          variant="outline"
          size="icon"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <p className="mx-4">
          Page {pageNumber} of {numPages}
        </p>
        <Button
          onClick={() => setPageNumber(pageNumber + 1)}
          disabled={pageNumber >= (numPages || 0)}
          variant="outline"
          size="icon"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PDFViewer;
