import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, PackageCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/terms")({ component: TermsPage });

function TermsPage() {
	return (
		<div className="flex min-h-svh flex-col bg-background">
			<SiteHeader />
			<main className="flex-1">
				<div className="mx-auto max-w-3xl px-6 py-20">
					<div className="mb-12">
						<div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
							<FileText className="size-3.5" />
							Last updated: June 2026
						</div>
						<h1 className="mt-4 text-4xl font-bold tracking-tight">
							Terms of Service
						</h1>
						<p className="mt-3 text-muted-foreground">
							By using Quartermaster, you agree to these terms. Please read them
							carefully.
						</p>
					</div>

					<div className="prose prose-neutral dark:prose-invert max-w-none space-y-10">
						<Section
							title="1. Acceptance of terms"
							content={
								<p>
									By accessing or using Quartermaster (&ldquo;the
									Service&rdquo;), you agree to be bound by these Terms of
									Service. If you do not agree to these terms, you may not use
									the Service. We may update these terms from time to time, and
									your continued use of the Service after changes are posted
									constitutes acceptance of the revised terms.
								</p>
							}
						/>

						<Section
							title="2. Description of service"
							content={
								<p>
									Quartermaster is a personal asset management platform that
									allows you to track physical items you own, including their
									purchase details, warranty information, depreciation
									schedules, maintenance records, and associated documents. The
									Service is provided on an &ldquo;as is&rdquo; and &ldquo;as
									available&rdquo; basis.
								</p>
							}
						/>

						<Section
							title="3. Account registration"
							content={
								<>
									<p>
										To use the Service, you must create an account by providing
										accurate and complete information. You are responsible for:
									</p>
									<ul>
										<li>
											Maintaining the confidentiality of your account
											credentials
										</li>
										<li>All activities that occur under your account</li>
										<li>
											Notifying us immediately of any unauthorized use of your
											account
										</li>
									</ul>
									<p>
										You must be at least 13 years of age to create an account.
									</p>
								</>
							}
						/>

						<Section
							title="4. User content"
							content={
								<>
									<p>
										You retain ownership of all data you upload to the Service,
										including asset details, photos, receipts, and other
										documents (&ldquo;User Content&rdquo;). By submitting User
										Content, you grant us a limited, non-exclusive license to
										store, process, and display it solely for the purpose of
										providing the Service to you.
									</p>
									<p>
										You are solely responsible for your User Content and warrant
										that it does not violate any applicable laws or third-party
										rights.
									</p>
								</>
							}
						/>

						<Section
							title="5. Acceptable use"
							content={
								<>
									<p>You agree not to:</p>
									<ul>
										<li>
											Use the Service for any unlawful purpose or in violation
											of any applicable laws
										</li>
										<li>
											Upload viruses, malware, or any other malicious code
										</li>
										<li>
											Attempt to gain unauthorized access to the Service, other
											accounts, or underlying infrastructure
										</li>
										<li>
											Interfere with or disrupt the Service or its associated
											servers and networks
										</li>
										<li>
											Use automated means (scraping, bots) to access or extract
											data from the Service without our prior written consent
										</li>
										<li>
											Resell, sublicense, or otherwise commercialize the Service
											without authorization
										</li>
									</ul>
								</>
							}
						/>

						<Section
							title="6. Intellectual property"
							content={
								<p>
									The Service and its original content, features, and
									functionality are owned by Quartermaster and are protected by
									copyright, trademark, and other intellectual property laws.
									You may not copy, modify, distribute, sell, or lease any part
									of the Service without our prior written consent.
								</p>
							}
						/>

						<Section
							title="7. Third-party services"
							content={
								<p>
									The Service may integrate with third-party authentication
									providers (such as Google, GitHub, and Microsoft). Your use of
									these services is governed by their respective terms and
									privacy policies. We are not responsible for the practices of
									any third-party services.
								</p>
							}
						/>

						<Section
							title="8. Limitation of liability"
							content={
								<p>
									To the fullest extent permitted by law, Quartermaster and its
									operators shall not be liable for any indirect, incidental,
									special, consequential, or punitive damages arising out of
									your use of or inability to use the Service, including but not
									limited to loss of data, loss of profits, or business
									interruption, even if advised of the possibility of such
									damages. Our total liability for any claim related to the
									Service shall not exceed the amount you paid us (if any) in
									the twelve months preceding the claim.
								</p>
							}
						/>

						<Section
							title="9. Disclaimer of warranties"
							content={
								<p>
									The Service is provided without warranties of any kind, either
									express or implied. We do not warrant that the Service will be
									uninterrupted, error-free, secure, or free of viruses or other
									harmful components. You use the Service at your own risk.
								</p>
							}
						/>

						<Section
							title="10. Termination"
							content={
								<p>
									We may terminate or suspend your account and access to the
									Service at any time, with or without cause, and with or
									without notice. Upon termination, your right to use the
									Service will immediately cease. You may also terminate your
									account at any time by contacting us. Provisions that by their
									nature should survive termination (including ownership,
									disclaimers, and limitations of liability) shall do so.
								</p>
							}
						/>

						<Section
							title="11. Governing law"
							content={
								<p>
									These terms shall be governed by the laws of the jurisdiction
									in which the Service operator is established, without regard
									to conflict of law principles. Any disputes arising from these
									terms or the Service shall be resolved exclusively in the
									courts of that jurisdiction.
								</p>
							}
						/>

						<Section
							title="12. Changes to the service"
							content={
								<p>
									We reserve the right to modify, suspend, or discontinue any
									aspect of the Service at any time without prior notice. We
									will make reasonable efforts to notify users of material
									changes that affect the core functionality of the Service.
								</p>
							}
						/>

						<Section
							title="13. Contact"
							content={
								<p>
									For questions about these Terms of Service, please contact us
									at{" "}
									<a
										href="mailto:legal@quartermaster.app"
										className="text-primary hover:underline"
									>
										legal@quartermaster.app
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
					<Link
						to="/terms"
						className="text-foreground hover:text-foreground transition-colors"
					>
						Terms
					</Link>
					<Link
						to="/privacy"
						className="hover:text-foreground transition-colors"
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
			<div className="mt-3 space-y-3 text-sm text-muted-foreground leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1">
				{content}
			</div>
		</section>
	);
}
