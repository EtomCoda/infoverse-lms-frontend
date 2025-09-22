import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const navigationLinks = [
  { label: "Dashboard Overview", to: "/admin/dashboard" },
  { label: "Landing Page", to: "/" },
];

const dashboardMetrics = [
  {
    title: "Active Students",
    value: "1,248",
    description: "Learners who engaged with a course this week.",
  },
  {
    title: "Courses Published",
    value: "36",
    description: "Total courses currently visible to students.",
  },
  {
    title: "New Enrolments",
    value: "182",
    description: "Sign-ups recorded over the last 7 days.",
  },
  {
    title: "Support Tickets",
    value: "5",
    description: "Open requests awaiting a response from staff.",
  },
];

const recentCourses = [
  {
    name: "Calculus Essentials",
    category: "Mathematics",
    learners: 320,
  },
  {
    name: "World History Primer",
    category: "Humanities",
    learners: 274,
  },
  {
    name: "Exam Prep: Biology",
    category: "Science",
    learners: 198,
  },
];

export const AdminDashboardPage = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row">
        <aside className="w-full max-w-xs space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900">Infoverse Admin</h1>
            <p className="text-sm text-slate-600">
              Manage your learning community and keep track of student success.
            </p>
          </div>

          <nav className="space-y-1">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/admin/dashboard"}
                className={({ isActive }) =>
                  cn(
                    "block rounded-lg px-4 py-2 text-base font-medium transition-colors",
                    isActive
                      ? "bg-[#33a1cd] text-white shadow"
                      : "text-slate-700 hover:bg-slate-100",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <Button
            asChild
            className="w-full bg-[#dd7c5e] text-base font-semibold hover:bg-[#dd7c5e]/90"
          >
            <Link to="/">Return to site</Link>
          </Button>
        </aside>

        <main className="flex-1 space-y-6">
          <header className="space-y-1">
            <h2 className="text-3xl font-semibold text-slate-900">Dashboard</h2>
            <p className="text-sm text-slate-600">
              A quick snapshot of how the Infoverse learning platform is performing
              today.
            </p>
          </header>

          <section className="grid gap-6 md:grid-cols-2">
            {dashboardMetrics.map((metric) => (
              <Card key={metric.title} className="border-none bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    {metric.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-500">
                    {metric.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-slate-900">{metric.value}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          <Card className="border-none bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Recent courses
              </CardTitle>
              <CardDescription className="text-sm text-slate-500">
                Latest additions that are resonating with students.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentCourses.map((course) => (
                <div
                  key={course.name}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="text-base font-medium text-slate-900">
                      {course.name}
                    </p>
                    <p className="text-sm text-slate-600">{course.category}</p>
                  </div>
                  <span className="rounded-full bg-[#33a1cd]/10 px-3 py-1 text-xs font-semibold text-[#33a1cd]">
                    {course.learners} learners
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
