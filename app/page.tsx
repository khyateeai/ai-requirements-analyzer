"use client";

import { useState } from "react";

type TestCase = {
  id: string;
  title: string;
  input: string;
  expectedResult: string;
};

type EdgeCase = {
  scenario: string;
  expectedResult: string;
};

type Analysis = {
  requirementType: string;
  ambiguities: string[];
  missingInformation: string[];
  completeness: string;
  improvedRequirement: string;
  testCases: TestCase[];
  edgeCases: EdgeCase[];
};

export default function Home() {
  const [requirement, setRequirement] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyzeRequirement() {
    if (!requirement.trim()) {
      setError("Please enter a software requirement first.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirement }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed.");
      }

      setAnalysis(data.result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            AI-Powered Software Testing
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Requirements Analyzer
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            Analyze software requirements, identify ambiguity and missing
            information, improve requirement quality, and generate test cases
            with the help of AI.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
          <label
            htmlFor="requirement"
            className="mb-3 block text-lg font-semibold"
          >
            Enter your software requirement
          </label>

          <textarea
            id="requirement"
            value={requirement}
            onChange={(event) => setRequirement(event.target.value)}
            placeholder="Example: The user should be able to log in using their email and password."
            maxLength={5000}
            rows={6}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-slate-100 outline-none transition focus:border-cyan-400"
          />

          <div className="mt-2 flex justify-between text-sm text-slate-400">
            <span>Be as specific as possible.</span>
            <span>{requirement.length}/5000</span>
          </div>

          <button
            onClick={analyzeRequirement}
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? "Analyzing requirement..." : "Analyze Requirement"}
          </button>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-lg border border-red-800 bg-red-950 p-4 text-red-200"
            >
              {error}
            </p>
          )}
        </section>

        {analysis && (
          <section className="mt-8 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold">Analysis Results</h2>
              <p className="mt-4 text-slate-300">
                <strong className="text-cyan-300">Requirement type: </strong>
                {analysis.requirementType}
              </p>
              <p className="mt-3 leading-7 text-slate-300">
                <strong className="text-cyan-300">Completeness: </strong>
                {analysis.completeness}
              </p>
            </div>

            <ResultList
              title="Ambiguities Identified"
              items={analysis.ambiguities}
            />
            <ResultList
              title="Missing Information"
              items={analysis.missingInformation}
            />

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-bold text-cyan-300">
                Improved Requirement
              </h2>
              <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-300">
                {analysis.improvedRequirement}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="mb-4 text-xl font-bold">Functional Test Cases</h2>
              {analysis.testCases?.map((test, index) => (
                <div
                  key={test.id || index}
                  className="mb-4 rounded-xl border border-slate-700 p-4 last:mb-0"
                >
                  <h3 className="font-semibold text-cyan-300">
                    {test.id}: {test.title}
                  </h3>
                  <p className="mt-2 text-slate-300">
                    <strong>Input: </strong>
                    {test.input}
                  </p>
                  <p className="mt-2 text-slate-300">
                    <strong>Expected result: </strong>
                    {test.expectedResult}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="mb-4 text-xl font-bold">Edge Cases</h2>
              {analysis.edgeCases?.map((item, index) => (
                <div
                  key={index}
                  className="mb-4 rounded-xl border border-slate-700 p-4 last:mb-0"
                >
                  <h3 className="font-semibold text-cyan-300">
                    {item.scenario}
                  </h3>
                  <p className="mt-2 text-slate-300">
                    <strong>Expected result: </strong>
                    {item.expectedResult}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center text-sm text-slate-500">
          AI Requirements Analyzer &amp; Test Case Generator
        </footer>
      </div>
    </main>
  );
}

function ResultList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-bold">{title}</h2>
      {items?.length ? (
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-slate-400">No items reported.</p>
      )}
    </div>
  );
}
