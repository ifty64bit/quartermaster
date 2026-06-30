import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, PackageCheck, Shield } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

function PrivacyPage() {
	return (
		<div className="flex min-h-svh flex-col bg-background">
			<SiteHeader />
			<main className="flex-1">
				<div className="mx-auto max-w-3xl px-6 py-20">
					<div className="mb-12">
						<div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
							<Shield className="size-3.5" />
							Last updated: June 2026
						</div>
						<h1 className="mt-4 text-4xl font-bold tracking-tight">
							Privacy Policy
						</h1>
						<p className="mt-3 text-muted-foreground">
							We take your privacy seriously. This policy explains what
							information we collect, how we use it, and how we protect it.
						</p>
					</div>

					<div className="prose prose-neutral dark:prose-invert max-w-none space-y-10">
						<Section
							title="1. Information we collect"
							content={
								<>
									<h3 className="text-base font-semibold">
										Account information
									</h3>
									<p>
										When you sign up for Quartermaster, we collect your name,
										email address, and authentication credentials. If you sign
										in via a third-party provider (Google, GitHub, Microsoft),
										we receive your name and email from that provider.
									</p>
									<h3 className="text-base font-semibold">Asset data</h3>
									<p>
										You may voluntarily provide details about the physical items
										you own, including purchase prices, serial numbers, photos,
										warranty information, receipts, and maintenance records.
										This data is stored to serve the core purpose of the
										application.
									</p>
									<h3 className="text-base font-semibold">Usage data</h3>
									<p>
										We may collect anonymized, aggregated usage information such
										as page views and feature usage to improve the product. This
										data does not identify individual users.
									</p>
								</>
							}
						/>

						<Section
							title="2. How we use your information"
							content={
								<>
									<p>
										We use your information exclusively to provide and improve
										the Quartermaster service:
									</p>
									<ul>
										<li>Authenticate your account and keep it secure</li>
										<li>
											Store and display your asset inventory, categories,
											brands, and related records
										</li>
										<li>
											Send transactional emails such as warranty expiry alerts
											and account notifications
										</li>
										<li>
											Analyze aggregated, anonymized usage patterns to improve
											the product
										</li>
									</ul>
								</>
							}
						/>

						<Section
							title="3. Data storage and security"
							content={
								<p>
									Your data is stored on secure servers using industry-standard
									encryption at rest and in transit. Authentication tokens are
									hashed and salted. We regularly review our security practices
									and promptly address reported vulnerabilities. However, no
									online service is 100% secure, and we cannot guarantee
									absolute security.
								</p>
							}
						/>

						<Section
							title="4. Data sharing"
							content={
								<>
									<p>
										We do not sell, rent, or trade your personal data to third
										parties. We may share information only in the following
										circumstances:
									</p>
									<ul>
										<li>
											With service providers who help us operate the application
											(hosting, database, email delivery) and are bound by data
											processing agreements
										</li>
										<li>
											If required by law, court order, or governmental
											regulation
										</li>
										<li>
											If necessary to protect the rights, property, or safety of
											Quartermaster, our users, or the public
										</li>
									</ul>
								</>
							}
						/>

						<Section
							title="5. Your rights"
							content={
								<>
									<p>
										Depending on your jurisdiction, you may have the right to:
									</p>
									<ul>
										<li>Access the personal data we hold about you</li>
										<li>
											Request correction or deletion of your personal data
										</li>
										<li>
											Export your data in a portable format (contact us for
											assistance)
										</li>
										<li>Object to certain processing activities</li>
										<li>
											Withdraw consent where processing is based on consent
										</li>
									</ul>
									<p>
										To exercise any of these rights, please contact us at the
										email address listed at the end of this policy.
									</p>
								</>
							}
						/>

						<Section
							title="6. Cookies"
							content={
								<p>
									Quartermaster uses essential cookies required for
									authentication and session management. We do not use
									third-party tracking cookies or advertising cookies. You can
									configure your browser to reject cookies, but this may prevent
									you from signing in to the application.
								</p>
							}
						/>

						<Section
							title="7. Data retention"
							content={
								<p>
									We retain your account information and asset data for as long
									as your account is active. If you delete your account, we will
									permanently remove your data within 30 days, except where
									retention is required by law.
								</p>
							}
						/>

						<Section
							title="8. Children's privacy"
							content={
								<p>
									Quartermaster is not intended for children under the age of
									13. We do not knowingly collect personal information from
									children under 13. If we become aware that a child under 13
									has provided personal data, we will delete it promptly.
								</p>
							}
						/>

						<Section
							title="9. Changes to this policy"
							content={
								<p>
									We may update this privacy policy from time to time. We will
									notify you of material changes by email or by posting a notice
									on our website prior to the change becoming effective. Your
									continued use of Quartermaster after changes take effect
									constitutes acceptance of the updated policy.
								</p>
							}
						/>

						<Section
							title="10. Contact us"
							content={
								<p>
									If you have questions about this privacy policy or wish to
									exercise your data rights, please contact us at{" "}
									<a
										href="mailto:privacy@quartermaster.app"
										className="text-primary hover:underline"
									>
										ifty64bit@gmail.com
									</a>
									.
								</p>
							}
						/>
					</div>

					<div className="mt-16 rounded-xl border bg-muted/30 p-8 text-center">
						<p className="text-sm text-muted-foreground">
							Ready to take control of your inventory?
						</p>
						<div className="mt-4">
							<Link to="/signup" className={buttonVariants({ size: "lg" })}>
								Create your free account
								<ArrowRight />
							</Link>
						</div>
					</div>
				</div>
			</main>
			<SiteFooter />
		</div>
	);
}

function SiteHeader() {
	return (
		<header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
				<Link
					to="/"
					className="flex items-center gap-2 font-semibold tracking-tight"
				>
					<PackageCheck className="size-6" />
					<span className="text-lg">Quartermaster</span>
				</Link>
				<nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
					<Link to="/terms" className="hover:text-foreground transition-colors">
						Terms
					</Link>
					<Link
						to="/privacy"
						className="text-foreground hover:text-foreground transition-colors"
					>
						Privacy
					</Link>
				</nav>
				<div className="flex items-center gap-2">
					<Link
						to="/login"
						className={buttonVariants({ variant: "ghost", size: "sm" })}
					>
						Sign in
					</Link>
					<Link to="/signup" className={buttonVariants({ size: "sm" })}>
						Get started
						<ArrowRight />
					</Link>
				</div>
			</div>
		</header>
	);
}

function SiteFooter() {
	return (
		<footer className="mx-auto w-full max-w-6xl px-6 py-10 text-sm text-muted-foreground">
			<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
				<div className="flex items-center gap-2">
					<PackageCheck className="size-5" />
					<span className="font-medium text-foreground">Quartermaster</span>
				</div>
				<nav className="flex items-center gap-6">
					<Link to="/terms" className="hover:text-foreground transition-colors">
						Terms
					</Link>
					<Link
						to="/privacy"
						className="hover:text-foreground transition-colors"
					>
						Privacy
					</Link>
					<Link to="/login" className="hover:text-foreground transition-colors">
						Sign in
					</Link>
				</nav>
				<p className="text-xs">
					© {new Date().getFullYear()} Quartermaster · Personal asset management
				</p>
			</div>
		</footer>
	);
}

function Section({
	title,
	content,
}: {
	title: string;
	content: React.ReactNode;
}) {
	return (
		<section>
			<h2 className="text-xl font-semibold tracking-tight">{title}</h2>
			<div className="mt-3 space-y-3 text-sm text-muted-foreground leading-relaxed [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1">
				{content}
			</div>
		</section>
	);
}
