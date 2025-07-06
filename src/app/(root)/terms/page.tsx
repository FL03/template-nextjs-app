/*
  Appellation: terms <page>
  Contrib: @FL03
*/
'use client';
// imports
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';

export default function Page() {
  return (
    <div className="flex-1 w-full">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Terms & Conditions</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>

        </CardContent>
      </Card>
    </div>
  );
};
Page.displayName = 'TermsPage';
